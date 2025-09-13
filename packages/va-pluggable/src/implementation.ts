import { identifiers } from '@bedrock-apis/common';
import { ContextPluginLinkedStorage, InvocationInfo } from '@bedrock-apis/virtual-apis';
import { Plugin } from './api';
import { PluginModule, PluginModuleLoaded } from './module';
import { ModuleTypeMap, StorageThis, ThisContext } from './types';

export class Impl {
   public static getModuleAndImpl(impl: Impl) {
      return { module: impl.module, impl: impl.implementation, className: impl.className };
   }

   public constructor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      protected readonly module: PluginModule<any, Plugin>,
      protected readonly className: string,
      protected readonly implementation: object,
   ) {
      this.module.onLoad.subscribe((loaded, versions) => {
         for (const { nameVersion } of versions) {
            for (const [key, prop] of Object.entries(Object.getOwnPropertyDescriptors(implementation))) {
               if (prop.get) {
                  this.implGetSet(loaded, nameVersion, key, prop);
               } else {
                  this.implMethod(key, nameVersion, prop, loaded);
               }
            }
         }
      });
   }

   private implMethod(key: string, version: string, prop: PropertyDescriptor, loaded: PluginModuleLoaded) {
      if (key === 'constructor') {
         this.module.plugin.context.implement(version, this.ctorKey(this.className), ctx => {
            prop.value.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ...ctx.params);
         });
      } else {
         this.module.plugin.context.implement(version, this.methodKey(this.className, key), ctx => {
            ctx.result = prop.value.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ...ctx.params);
         });
      }
   }

   private implGetSet(loaded: PluginModuleLoaded, version: string, key: string, { get, set }: PropertyDescriptor) {
      if (get) {
         this.module.plugin.context.implement(version, this.getterKey(this.className, key), ctx => {
            ctx.result = get.call(this.getThisValue(ctx.thisObject!, ctx, loaded));
         });
      }
      if (set) {
         this.module.plugin.context.implement(version, this.setterKey(this.className, key), ctx => {
            ctx.result = set.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ctx.params[0]);
         });
      }
   }

   protected getKey(key: string) {
      return `${this.className}::${key}`;
   }

   protected methodKey = identifiers.method;
   protected getterKey = identifiers.getter;
   protected setterKey = identifiers.setter;
   protected ctorKey = identifiers.constructor;

   protected getThisValue(
      native: unknown,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ): ThisContext<object, Plugin, ModuleTypeMap> {
      return new ThisContext(invocation, native as object, this.implementation, loaded, this.module.plugin);
   }
}

export class ImplStatic extends Impl {
   protected override methodKey = identifiers.static.method;
   protected override getterKey = identifiers.static.getter;
   protected override setterKey = identifiers.static.setter;
}

export class ImplStoraged<T extends object, Native extends object> extends Impl {
   public static getStorage<T extends ImplStoraged<object, object>>(t: T) {
      return t.storage;
   }

   public storage!: ContextPluginLinkedStorage<T>;

   public constructor(
      module: PluginModule,
      className: string,
      implementation: object,
      protected createStorage: (n: object, m: PluginModuleLoaded<ModuleTypeMap>) => T,
   ) {
      super(module, className, implementation);
      this.module.onLoad.subscribe(l => this.onLoad(l));
   }

   protected onLoad(loaded: PluginModuleLoaded) {
      this.loaded = loaded;
      this.storage = new ContextPluginLinkedStorage(native => this.createStorage(native, loaded));
   }

   protected loaded?: PluginModuleLoaded;

   protected override getThisValue(
      native: unknown,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ) {
      return StorageThis.create(
         this.getStorage(native as Native),
         invocation,
         native as object,
         this.implementation,
         loaded,
         this.module.plugin,
      ) as StorageThis<object, Plugin, ModuleTypeMap, T>;
   }

   public getStorage(nativeObject: Native): T {
      return this.storage.get(nativeObject);
   }

   public create(partialStorage: Partial<T>): Native {
      if (!this.loaded) {
         throw new Error(
            `Unable to create ${this.className} implemented by ${this.module.plugin.identifier}: module not loaded`,
         );
      }

      const native = this.loaded.construct(this.className);
      const storage = this.getKey(native);
      Object.assign(storage, partialStorage);
      return native;
   }
}
