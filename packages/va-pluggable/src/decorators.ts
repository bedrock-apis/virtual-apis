import { MapWithDefaults, VaEventEmitter } from '@bedrock-apis/va-common';
import {
   ArrayType,
   CompilableSymbol,
   ConstructableSymbol,
   Context,
   InterfaceSymbol,
   InvocableSymbol,
   InvocationInfo,
   MapType,
   ObjectValueSymbol,
   OptionalType,
   PromiseType,
   PropertyGetterSymbol,
   RuntimeType,
   VariantType,
} from '@bedrock-apis/virtual-apis';
import util from 'node:util';
import { Pluggable } from './pluggable';
import { triggerAsyncId } from 'node:async_hooks';

// Usually used as array to support inheritance
export interface DecoratedMetadata {
   classId: string;
   moduleNameVersion: string;
   static: boolean;
}

export const staticMetaSymbol = Symbol('virtualApis::staticMetadata');
export const prototypeMetaSymbol = Symbol('virtualApis::prototypeMetadata');
export const storageMapper = Symbol('virtualApis::storageMapper');
export const storageUnmap = Symbol('virtualApis::storageUnmap');

export type StorageMapper = (type: RuntimeType, storage: object, context: Context) => object;
export type StorageUnmap = (type: RuntimeType, handle: object, context: Context) => object;

export type GetStorage = (ctx: InvocationInfo) => object | undefined;

type Converter = (value: unknown, context: Context) => unknown;

export interface HandleStorageConverter {
   storageToHandle: Converter;
   handleToStorage: Converter;
}

export class VirtualFeatureDecorators {
   private getMeta(symbol: symbol, target: object): DecoratedMetadata[] {
      const meta = symbol in target ? (target as Record<symbol, DecoratedMetadata[]>)[symbol] : undefined;
      // Error is so detailed for debug only. Remove later
      if (!meta) throw new Error(`No metadata for ${symbol.toString()} in ${util.inspect(target, true, 20, true)}`);

      return meta;
   }

   public getStaticMeta = this.getMeta.bind(this, staticMetaSymbol);
   public getPrototypeMeta = this.getMeta.bind(this, prototypeMetaSymbol);

   public createGetStorageInstanced(this: void, plugin: Pluggable) {
      const getStorage = (ctx: InvocationInfo) => {
         const s = plugin.getStorage(ctx.thisObject as object);
         if (!s) throw new Error('no storage for ' + util.inspect(ctx.thisObject, true, 20, true));
         return s;
      };

      return getStorage;
   }

   public createGetStorageStatic(this: void, _: Pluggable, target: object) {
      return (__: InvocationInfo) => target;
   }

   public createMethodDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata[],
      createGetStorage: (plugin: Pluggable, target: object) => GetStorage,
      symbolType: new () => InvocableSymbol<unknown>,
   ): MethodDecorator {
      return (target, propertyKey) => {
         const metaArray = getMeta(target as object);

         for (const meta of metaArray) {
            this.registerImplementation(meta, nativeId, symbolType, (symbol, plugin) => {
               const getStorage = createGetStorage(plugin, target);

               this.registerFnListener(symbol, plugin, propertyKey, getStorage);
            });
         }
      };
   }

   private registerFnListener(
      symbol: InvocableSymbol<unknown>,
      plugin: Pluggable,
      propertyKey: string | symbol,
      getStorage: GetStorage,
   ) {
      const mapper = this.createHandleStorageConverter(symbol.returnType);
      plugin.registerCallback(symbol, ctx => {
         const self = getStorage(ctx) as Record<string | symbol, (...args: unknown[]) => void>;
         ctx.result = mapper.storageToHandle(Reflect.apply(self[propertyKey]!, self, ctx.params), ctx.context);
      });
   }

   public createPropertyDecorator(
      nativeId: string,
      getMeta: (target: object) => DecoratedMetadata[],
      createGetStorage: (plugin: Pluggable, target: object) => GetStorage,
   ): PropertyDecorator {
      return (target, propertyKey) => {
         const metaArray = getMeta(target as object);

         for (const meta of metaArray) {
            this.registerImplementation(meta, nativeId, PropertyGetterSymbol, (symbol, plugin) => {
               const getStorage = createGetStorage(plugin, target);

               this.registerPropertyListener(symbol, plugin, propertyKey, getStorage);
            });
         }
      };
   }

   private registerPropertyListener(
      symbol: PropertyGetterSymbol,
      plugin: Pluggable,
      propertyKey: string | symbol,
      getStorage: GetStorage,
   ) {
      const mapper = this.createHandleStorageConverter(symbol.returnType);
      plugin.registerCallback(symbol, ctx => {
         const self = getStorage(ctx);
         ctx.result = mapper.storageToHandle(Reflect.get(self as object, propertyKey, self), ctx.context);
      });

      if (symbol.setter) {
         plugin.registerCallback(symbol.setter, ctx => {
            const self = getStorage(ctx);
            return Reflect.set(self as object, propertyKey, mapper.handleToStorage(ctx.params[0], ctx.context), self);
         });
      }
   }

   public onClassLoad(meta: DecoratedMetadata, callback: (s: ConstructableSymbol, plugin: Pluggable) => void) {
      this.implementations
         .getOrCreate(meta.moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(meta.classId, () => [])
         .push((s, plugin) => {
            if (!(s instanceof ConstructableSymbol)) throw new Error(`Not a class: ${s.name}`);

            callback(s, plugin);
         });
   }

   public registerConstructable(target: new (...args: unknown[]) => object) {
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

   public registerCallsRedirect(target: object, fromKey: string | symbol) {
      const metaArray = this.getPrototypeMeta(target);
      const meta = metaArray.at(-1)!; // Only latest one
      this.onClassLoad(meta, (s, plugin) => {
         for (const [name, symbol] of s.prototypeFields) {
            if (!(symbol instanceof InvocableSymbol)) continue;
            const getStorage: GetStorage = ctx =>
               (plugin.getStorage(ctx.thisObject as object) as Record<string | symbol, object>)[fromKey];

            if (symbol instanceof PropertyGetterSymbol) {
               this.registerPropertyListener(symbol, plugin, name, getStorage);
            } else {
               this.registerFnListener(symbol, plugin, name, getStorage);
            }
         }
      });
   }

   private asIsConverters: HandleStorageConverter = {
      storageToHandle: value => value,
      handleToStorage: value => value,
   };

   // E.g. for mapping SerenityEntity to ScriptEntity
   public addStorageMapper(classPrototype: object, storageToHandle: StorageMapper, handleToStorage: StorageUnmap) {
      (classPrototype as Record<symbol, StorageMapper>)[storageMapper] = storageToHandle;
      // TODO IT WILL NOT WORK WE NEED TO DEFINE IT ON HANDLE ITSELF
      (classPrototype as Record<symbol, StorageUnmap>)[storageUnmap] = handleToStorage;
   }

   // Precompute converters
   public createHandleStorageConverter(type: RuntimeType): HandleStorageConverter {
      if (type instanceof ConstructableSymbol) {
         return {
            storageToHandle: (storage, context) => {
               if (typeof storage !== 'object' || !storage) return storage;
               if (storageMapper in storage) {
                  storage = (storage[storageMapper] as StorageMapper)(type, storage, context);
               }
               return context.plugin.getCreateHandleFor(storage as object, type);
            },
            handleToStorage: (handle, context) => {
               if (typeof handle !== 'object' || !handle) return handle;
               if (storageUnmap in handle) {
                  handle = (handle[storageUnmap] as StorageUnmap)(type, handle, context);
               }
               return context.plugin.getStorage(handle as object);
            },
         };
      }

      if (type instanceof OptionalType) {
         const innerConverter = this.createHandleStorageConverter(type.type);
         return {
            storageToHandle: (storage, context) => {
               if (!storage) return storage;
               return innerConverter.storageToHandle(storage, context);
            },
            handleToStorage: (handle, context) => {
               if (!handle) return handle;
               return innerConverter.handleToStorage(handle, context);
            },
         };
      }

      if (type instanceof ArrayType) {
         const innerConverter = this.createHandleStorageConverter(type.valueType);
         return {
            storageToHandle: (storage, context) => {
               if (!Array.isArray(storage)) return storage;
               return storage.map(item => innerConverter.storageToHandle(item, context));
            },
            handleToStorage: (handle, context) => {
               if (!Array.isArray(handle)) return handle;
               return handle.map(item => innerConverter.handleToStorage(item, context));
            },
         };
      }

      if (type instanceof InterfaceSymbol) {
         // TODO Fix
         if (type.name === 'RawMessage') return this.asIsConverters;

         const innerConverters = [...type.properties.entries()].map(
            e => [e[0], this.createHandleStorageConverter(e[1])] as const,
         );

         return {
            storageToHandle(storage, c) {
               if (typeof storage !== 'object' || !storage) return storage;
               const result: Record<string, unknown> = {};
               for (const [key, type] of innerConverters)
                  result[key] = type.storageToHandle((storage as Record<string, unknown>)[key], c);

               return result;
            },
            handleToStorage(handle, c) {
               if (typeof handle !== 'object' || !handle) return handle;

               const result: Record<string, unknown> = {};
               for (const [key, type] of innerConverters)
                  result[key] = type.handleToStorage((handle as Record<string, unknown>)[key], c);

               return result;
            },
         };
      }

      if (type instanceof MapType) {
         const innerConverter = this.createHandleStorageConverter(type.valueType);
         if (innerConverter === this.asIsConverters) return this.asIsConverters;

         return {
            storageToHandle(storage, c) {
               if (typeof storage !== 'object' || !storage) return storage;
               const result: Record<string, unknown> = {};
               for (const [key, value] of Object.entries(storage))
                  result[key] = innerConverter.storageToHandle(value, c);

               return result;
            },
            handleToStorage(handle, c) {
               if (typeof handle !== 'object' || !handle) return handle;
               const result: Record<string, unknown> = {};
               for (const [key, value] of Object.entries(handle))
                  result[key] = innerConverter.handleToStorage(value, c);

               return result;
            },
         };
      }

      if (type instanceof VariantType) {
         const variantConverters = type.variants.map(v => this.createHandleStorageConverter(v));
         return {
            storageToHandle: storage => {
               // TODO Convert
               return storage;
            },
            handleToStorage: (handle, context) => {
               if (typeof handle !== 'object' || !handle) return handle;
               if (storageUnmap in handle) {
                  handle = (handle[storageUnmap] as StorageUnmap)(type, handle, context);
               }

               for (let i = 0; i < variantConverters.length; i++) {
                  const converted = variantConverters[i]!.handleToStorage(handle, context);
                  if (converted !== handle) return converted;
               }
               return handle;
            },
         };
      }

      if (type instanceof PromiseType) {
         const innerConverter = this.createHandleStorageConverter(type.valueType);
         return {
            storageToHandle: (storage, context) => {
               if (!(storage instanceof Promise)) return storage;
               return new Promise((resolve, reject) => {
                  storage.then(value => resolve(innerConverter.storageToHandle(value, context)), reject);
               });
            },
            handleToStorage: (handle, context) => {
               throw new Error(`Converting from Promise<${type.valueType.name}> to storage is not supported right now`);
            },
         };
      }

      // Return simple types as is
      return this.asIsConverters;
   }

   public assignMetadata(virtualClass: { prototype: object }, meta: { classId: string; moduleNameVersion: string }[]) {
      const prototypeVa = virtualClass.prototype as Record<symbol, DecoratedMetadata[]>;
      prototypeVa[prototypeMetaSymbol] = meta.map(e => ({ ...e, static: false }));

      const staticVa = virtualClass as unknown as Record<symbol, DecoratedMetadata[]>;
      staticVa[staticMetaSymbol] = meta.map(e => ({ ...e, static: true }));
   }

   public constructor(onReadyEvent: VaEventEmitter<[Pluggable]>) {
      onReadyEvent.subscribe(plugin => {
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

   public registerImplementation<T extends new () => InvocableSymbol<unknown>>(
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

   public registerConstant(moduleNameVersion: string, id: string, storage: object) {
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
