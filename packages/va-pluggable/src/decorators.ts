import { MapWithDefaults } from '@bedrock-apis/va-common';
import {
   ArrayType,
   CompilableSymbol,
   ConstructableSymbol,
   Context,
   InvocableSymbol,
   ObjectValueSymbol,
   OptionalType,
   PropertyGetterSymbol,
   RuntimeType,
} from '@bedrock-apis/virtual-apis';
import util from 'node:util';
import { PluginFeature } from './feature';
import { Pluggable } from './pluggable';

export interface DecoratedMetadata {
   classId: string;
   moduleNameVersion: string;
   static: boolean;
}

export class VirtualFeatureDecorators {
   private static staticMetaSymbol = Symbol('virtualApis::staticMetadata');
   private static prototypeMetaSymbol = Symbol('virtualApis::prototypeMetadata');
   private getMeta(symbol: symbol, target: object): DecoratedMetadata {
      const meta = symbol in target ? (target as Record<symbol, DecoratedMetadata>)[symbol] : undefined;
      if (!meta)
         throw new Error('No metadata for ' + symbol.toString() + ' in ' + util.inspect(target, true, 20, true));
      return meta;
   }

   protected getStaticMeta = this.getMeta.bind(this, VirtualFeatureDecorators.staticMetaSymbol);
   protected getPrototypeMeta = this.getMeta.bind(this, VirtualFeatureDecorators.prototypeMetaSymbol);

   protected createMethodDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata,
      symbolType: new () => InvocableSymbol<unknown>,
   ): MethodDecorator {
      return (target, _, descriptor) => {
         const classMeta = getMeta(target as object);

         this.registerImplementation(classMeta, nativeId, symbolType, (symbol, plugin) => {
            const fn = descriptor.value as (...args: unknown[]) => void;

            if (this.isComplexType(symbol.returnType)) {
               plugin.registerCallback(
                  symbol,
                  ctx =>
                     (ctx.result = this.autoToHandle(
                        symbol.returnType,
                        fn.call(plugin.getStorage(ctx.thisObject ?? {}), ...ctx.params),
                        ctx.context,
                        ctx.thisObject as object,
                     )),
               );
            } else {
               plugin.registerCallback(
                  symbol,
                  ctx => (ctx.result = fn.call(plugin.getStorage(ctx.thisObject ?? {}), ...ctx.params)),
               );
            }
         });

         return descriptor;
      };
   }

   protected createPropertyDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata,
   ): PropertyDecorator {
      return (target, propertyKey) => {
         const classMeta = getMeta(target as object);

         this.registerImplementation(classMeta, nativeId, PropertyGetterSymbol, (symbol, plugin) => {
            if (this.isComplexType(symbol.returnType)) {
               plugin.registerCallback(symbol, ctx => {
                  const self = plugin.getStorage(ctx.thisObject as object);
                  ctx.result = this.autoToHandle(
                     ctx.symbol.returnType,
                     Reflect.get(self as object, propertyKey, self),
                     ctx.context,
                     ctx.thisObject as object,
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
                        this.autoFromHandle(symbol.returnType, ctx.params[0], ctx.context),
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
      };
   }

   // TODO(performance) Make it compileComplexTypeTransformer, basically the same but it will return from and to functions instead of boolean
   protected isComplexType(type: RuntimeType): boolean {
      if (type instanceof ConstructableSymbol) return true;
      if (type instanceof ArrayType) return this.isComplexType(type.valueType);
      if (type instanceof OptionalType) return this.isComplexType(type.type);

      // no other types needed
      return false;
   }

   protected autoToHandle(type: RuntimeType, storage: unknown, context: Context, thisObject: object): unknown {
      if (type instanceof ConstructableSymbol) return this.toHandle(storage, context, type, thisObject);
      if (type instanceof ArrayType) {
         return (storage as unknown[]).map(e => this.autoToHandle(type.valueType, e, context, thisObject));
      }
      if (type instanceof OptionalType) {
         if (!storage) return storage; // empty optional
         return this.autoToHandle(type.type, storage, context, thisObject);
      }

      throw new Error('Type was marked as complex and bindable but is actually not: ' + type.name);
   }

   protected autoFromHandle(type: RuntimeType, value: unknown, context: Context): unknown | undefined {
      if (type instanceof ConstructableSymbol) return this.fromHandle(value, context);
      if (type instanceof ArrayType) {
         return (value as unknown[]).map(e => this.autoFromHandle(type.valueType, e, context));
      }
      if (type instanceof OptionalType) {
         if (!value) return value; // empty optional
         return this.autoFromHandle(type.type, value, context);
      }

      throw new Error('Type was marked as complex and bindable but is actually not: ' + type.name);
   }

   protected fromHandle(value: unknown, context: Context) {
      if (typeof value !== 'object' || !value) return value;

      return context.plugin.getStorage(value);
   }

   protected toHandle(storage: unknown, context: Context, symbol: InvocableSymbol<unknown>, thisObject: object) {
      if (typeof storage !== 'object' || !storage) return storage;

      const meta = this.getPrototypeMeta(storage);
      if (!meta) return storage;

      const returnType = symbol.returnType;
      if (!(returnType instanceof ConstructableSymbol)) return storage;

      return context.plugin.getCreateHandleFor(storage, returnType);
   }

   protected assignMetadata(virtualClass: { prototype: object }, classId: string, moduleNameVersion: string) {
      const prototypeVa = virtualClass.prototype as Record<symbol, DecoratedMetadata>;
      prototypeVa[VirtualFeatureDecorators.prototypeMetaSymbol] = { classId, moduleNameVersion, static: false };

      const staticVa = virtualClass as unknown as Record<symbol, DecoratedMetadata>;
      staticVa[VirtualFeatureDecorators.staticMetaSymbol] = { classId, moduleNameVersion, static: true };
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
      this.implementations
         .getOrCreate(meta.moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(meta.classId, () => [])
         .push((s, plugin) => {
            if (!(s instanceof ConstructableSymbol)) throw new Error(`Not a class: ${s.name}`);

            const property = (meta.static ? s.staticFields : s.prototypeFields).get(propertyKey);
            if (!(property instanceof symbolType))
               throw new Error(
                  `Unknown ${propertyKey} type: ${property?.constructor.name} expected ${symbolType.name}`,
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
