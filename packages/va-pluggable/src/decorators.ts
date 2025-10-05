import { MapWithDefaults } from '@bedrock-apis/va-common';
import {
   ArrayType,
   CompilableSymbol,
   ConstructableSymbol,
   Context,
   InvocableSymbol,
   ObjectValueSymbol,
   OptionalType,
   PromiseType,
   PropertyGetterSymbol,
   RuntimeType,
   VariantType,
} from '@bedrock-apis/virtual-apis';
import util from 'node:util';
import { PluginFeature } from './feature';
import { Pluggable } from './pluggable';

// Usually used as array to support inheritance
export interface DecoratedMetadata {
   classId: string;
   moduleNameVersion: string;
   static: boolean;
}

const staticMetaSymbol = Symbol('virtualApis::staticMetadata');
const prototypeMetaSymbol = Symbol('virtualApis::prototypeMetadata');
const storageMapper = Symbol('virtualApis::storageMapper');
const storageUnmap = Symbol('virtualApis::storageUnmap');

type StorageMapper = (type: RuntimeType, storage: object, context: Context) => object;
type StorageUnmap = (type: RuntimeType, handle: object, context: Context) => object;

export class VirtualFeatureDecorators {
   private getMeta(symbol: symbol, target: object): DecoratedMetadata[] {
      const meta = symbol in target ? (target as Record<symbol, DecoratedMetadata[]>)[symbol] : undefined;
      // Error is so detailed for debug only. Remove later
      if (!meta) throw new Error(`No metadata for ${symbol.toString()} in ${util.inspect(target, true, 20, true)}`);

      return meta;
   }

   protected getStaticMeta = this.getMeta.bind(this, staticMetaSymbol);
   protected getPrototypeMeta = this.getMeta.bind(this, prototypeMetaSymbol);

   protected createMethodDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata[],
      symbolType: new () => InvocableSymbol<unknown>,
   ): MethodDecorator {
      return (target, _, descriptor) => {
         const metaArray = getMeta(target as object);

         for (const meta of metaArray) {
            this.registerImplementation(meta, nativeId, symbolType, (symbol, plugin) => {
               const fn = descriptor.value as (...args: unknown[]) => void;

               if (this.isComplexType(symbol.returnType)) {
                  plugin.registerCallback(
                     symbol,
                     ctx =>
                        (ctx.result = this.storageToHandle(
                           symbol.returnType,
                           fn.call(plugin.getStorage(ctx.thisObject as object), ...ctx.params),
                           ctx.context,
                        )),
                  );
               } else {
                  plugin.registerCallback(
                     symbol,
                     ctx => (ctx.result = fn.call(plugin.getStorage(ctx.thisObject as object), ...ctx.params)),
                  );
               }
            });
         }

         return descriptor;
      };
   }

   protected createPropertyDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata[],
   ): PropertyDecorator {
      return (target, propertyKey) => {
         const metaArray = getMeta(target as object);

         for (const meta of metaArray) {
            this.registerImplementation(meta, nativeId, PropertyGetterSymbol, (symbol, plugin) => {
               if (this.isComplexType(symbol.returnType)) {
                  plugin.registerCallback(symbol, ctx => {
                     const self = plugin.getStorage(ctx.thisObject as object);
                     ctx.result = this.storageToHandle(
                        ctx.symbol.returnType,
                        Reflect.get(self as object, propertyKey, self),
                        ctx.context,
                     );
                  });
               } else {
                  plugin.registerCallback(symbol, ctx => {
                     const self = plugin.getStorage(ctx.thisObject as object);
                     ctx.result = Reflect.get(self as object, propertyKey, self);
                  });
               }

               if (symbol.setter) {
                  if (this.isComplexType(symbol.returnType)) {
                     plugin.registerCallback(symbol.setter, ctx => {
                        const self = plugin.getStorage(ctx.thisObject as object);
                        return Reflect.set(
                           self as object,
                           propertyKey,
                           this.handleToStorage(symbol.returnType, ctx.params[0], ctx.context),
                           self,
                        );
                     });
                  } else {
                     plugin.registerCallback(symbol.setter, ctx => {
                        const self = plugin.getStorage(ctx.thisObject as object);
                        return Reflect.set(self as object, propertyKey, ctx.params[0], self);
                     });
                  }
               }
            });
         }
      };
   }

   protected onClassLoad(meta: DecoratedMetadata, callback: (s: ConstructableSymbol, plugin: Pluggable) => void) {
      this.implementations
         .getOrCreate(meta.moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(meta.classId, () => [])
         .push((s, plugin) => {
            if (!(s instanceof ConstructableSymbol)) throw new Error(`Not a class: ${s.name}`);

            callback(s, plugin);
         });
   }

   protected registerConstructable(target: new (...args: unknown[]) => object) {
      const metaArray = this.getStaticMeta(target);
      const meta = metaArray.at(-1)!; // Only latest one
      this.onClassLoad(meta, (s, plugin) => {
         plugin.registerCallback(s, ctx => {
            const storage = new target(...ctx.params);

            // We use ctx.result here because ctx.thisObject is not a native handle
            // which results in different storages between constructor and methods
            plugin.bindStorageWithHandle(ctx.result as object, storage);
         });
      });
   }

   protected registerCallsRedirect(target: new (...args: unknown[]) => object, fromKey: string) {
      const metaArray = this.getStaticMeta(target);
      const meta = metaArray.at(-1)!; // Only latest one
      this.onClassLoad(meta, (s, plugin) => {
         for (const [name, symbol] of s.prototypeFields) {
            if (!(symbol instanceof InvocableSymbol)) continue;

            plugin.registerCallback(symbol, ctx => {
               const self = plugin.getStorage(ctx.thisObject as object);
               const target = (self as Record<string, object>)[fromKey];

               // TODO Maybe there is a simpler way then redefining all of the get/set/method handlers with both complex/simple type
            });
         }
      });
   }

   protected isComplexType(type: RuntimeType): boolean {
      if (type instanceof ConstructableSymbol) return true;
      if (type instanceof OptionalType) return this.isComplexType(type.type);
      if (type instanceof ArrayType) return this.isComplexType(type.valueType);
      if (type instanceof VariantType) return type.variants.some(e => this.isComplexType(e));
      if (type instanceof PromiseType) return this.isComplexType(type.valueType);

      return false; // Simple type
   }

   // E.g. for mapping SerenityEntity to ScriptEntity
   protected addStorageMapper(classPrototype: object, storageToHandle: StorageMapper, handleToStorage: StorageUnmap) {
      (classPrototype as Record<symbol, StorageMapper>)[storageMapper] = storageToHandle;
      (classPrototype as Record<symbol, StorageUnmap>)[storageUnmap] = handleToStorage;
   }

   protected storageToHandle(type: RuntimeType, storage: unknown, context: Context): unknown {
      if (typeof storage !== 'object' || !storage) return storage;

      if (storageMapper in storage) storage = (storage[storageMapper] as StorageMapper)(type, storage, context);
      if (type instanceof ConstructableSymbol) return context.plugin.getCreateHandleFor(storage as object, type);
      if (type instanceof OptionalType) return this.storageToHandle(type.type, storage, context);
      if (type instanceof ArrayType) {
         return (storage as unknown[]).map(e => this.storageToHandle(type.valueType, e, context));
      }
      if (type instanceof VariantType) {
         // There is no return types that are variants
         throw new Error(`Converting from Variant<${type.name}> to handle is not supported right now`);
      }
      if (type instanceof PromiseType) {
         return new Promise((resolve, reject) => {
            const target = storage as Promise<unknown>;
            target.then(e => resolve(this.storageToHandle(type.valueType, e, context)));
            target.catch(reject);
         });
      }

      throw new Error('Type was marked as complex and bindable but is actually not: ' + type.name);
   }

   protected handleToStorage(type: RuntimeType, handle: unknown, context: Context): unknown | undefined {
      if (typeof handle !== 'object' || !handle) return handle;

      if (storageUnmap in handle) handle = (handle[storageUnmap] as StorageUnmap)(type, handle, context);
      if (type instanceof ConstructableSymbol) return context.plugin.getStorage(handle as object);
      if (type instanceof OptionalType) return this.handleToStorage(type.type, handle, context);
      if (type instanceof ArrayType) {
         return (handle as unknown[]).map(e => this.handleToStorage(type.valueType, e, context));
      }
      if (type instanceof VariantType) {
         for (const variant of type.variants) {
            const converted = this.handleToStorage(variant, handle, context);
            if (converted !== handle) return converted;
         }
         return handle;
      }

      if (type instanceof PromiseType) {
         // Is it really the case?
         throw new Error(`Converting from Promise<${type.valueType.name}> to storage is not supported right now`);
      }

      throw new Error('Type was marked as complex and bindable but is actually not: ' + type.name);
   }

   protected assignMetadata(
      virtualClass: { prototype: object },
      meta: { classId: string; moduleNameVersion: string }[],
   ) {
      const prototypeVa = virtualClass.prototype as Record<symbol, DecoratedMetadata[]>;
      prototypeVa[prototypeMetaSymbol] = meta.map(e => ({ ...e, static: false }));

      const staticVa = virtualClass as unknown as Record<symbol, DecoratedMetadata[]>;
      staticVa[staticMetaSymbol] = meta.map(e => ({ ...e, static: true }));
   }

   public constructor(feature: PluginFeature) {
      feature.onReadyEvent.subscribe(plugin => {
         for (const [version, classes] of this.implementations) {
            const module = plugin[version as 'server'];

            module.onLoad.subscribe((_, moduleSymbol) => {
               for (const [classId, implementations] of classes) {
                  const symbol = moduleSymbol.publicSymbols.get(classId);

                  if (symbol) for (const impl of implementations) impl(symbol, plugin);
               }
            });
         }
      });
   }

   private implementations = new MapWithDefaults<
      string,
      MapWithDefaults<string, ((s: CompilableSymbol<unknown>, plugin: Pluggable) => void)[]>
   >();

   protected registerImplementation<T extends new () => InvocableSymbol<unknown>>(
      meta: DecoratedMetadata,
      propertyKey: string,
      symbolType: T,
      onReady: (symbol: InstanceType<T>, plugin: Pluggable) => void,
   ) {
      this.onClassLoad(meta, (s, plugin) => {
         const property = (meta.static ? s.staticFields : s.prototypeFields).get(propertyKey);
         if (!(property instanceof symbolType))
            throw new Error(
               `Unknown ${meta.classId}::${propertyKey} type: ${property?.constructor.name} expected ${symbolType.name}`,
            );

         onReady(property as InstanceType<T>, plugin);
      });
   }

   protected registerConstant(moduleNameVersion: string, id: string, storage: object) {
      this.implementations
         .getOrCreate(moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(id, () => [])
         .push((s, plugin) => {
            if (!(s instanceof ObjectValueSymbol)) throw new Error(`Not an object symbol: ${s.name}`);

            plugin.bindStorageWithHandle(s.getRuntimeValue(plugin.context), storage);
         });
   }
}

export function withGeneratedModules<
   TT,
   Parent extends abstract new (...args: never[]) => unknown = new (...args: never[]) => unknown,
>(parentClass?: Parent) {
   function emptyParent() {}

   return (parentClass ?? emptyParent) as unknown as new (
      ...args: ConstructorParameters<Parent>
   ) => InstanceType<Parent> & TT;
}
