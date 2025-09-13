import { identifiers } from '@bedrock-apis/common';
import { ContextPluginLinkedStorage, InvocationInfo } from '@bedrock-apis/virtual-apis';
import { Plugin } from './api';
import { PluginModule, PluginModuleLoaded } from './module';
import { ModuleTypeMap, StorageThis, ThisContext } from './types';

export class Impl {
   public constructor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      public readonly module: PluginModule<any, Plugin>,
      public readonly className: string,
      public readonly implementation: object,
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
            // We use ctx.result here because ctx.thisObject is not a native handle
            // which results in different storages between constructor and methods
            prop.value.call(this.getThisValue(ctx.result!, ctx, loaded), ...ctx.params);
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
   public storage!: ContextPluginLinkedStorage<T>;

   public constructor(
      module: PluginModule,
      className: string,
      implementation: object,
      protected createStorage: (n: object, m: PluginModuleLoaded<ModuleTypeMap>, plugin: Plugin) => T,
      protected strict = false,
   ) {
      super(module, className, implementation);
      this.module.onLoad.subscribe(l => this.onLoad(l));
   }

   protected onLoad(loaded: PluginModuleLoaded) {
      this.loaded = loaded;
      this.storage = new ContextPluginLinkedStorage(
         native => this.createStorage(native, loaded, this.module.plugin),
         this.strict,
      );
   }

   protected loaded?: PluginModuleLoaded;

   protected override getThisValue(
      native: unknown,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ) {
      if (!this.module.plugin.context.isNativeHandle(native)) throw new Error('Not native');
      const t = new StorageThis(invocation, native as object, this.implementation, loaded, this.module.plugin);

      const creator = invocation.symbol.kind === 'constructor' ? this.storage.create : this.storage.get;
      (t as Mutable<typeof t>).storage = creator.call(this.storage, native as Native);

      return t;
   }

   public create(partialStorage: Partial<T>): Native {
      if (!this.loaded) {
         throw new Error(
            `Unable to create ${this.className} implemented by ${this.module.plugin.identifier}: module not loaded`,
         );
      }

      const native = this.loaded.construct(this.className);
      const storage = this.storage.create(native);
      Object.assign(storage, partialStorage);
      return native;
   }
}
