import { ConstructableSymbol, InvocableSymbol, InvocationInfo } from '@bedrock-apis/virtual-apis';
import { PluginModule, PluginModuleLoaded } from './module';
import { ModuleTypeMap, StorageThis, ThisContext } from './types';

export class Impl {
   public constructor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      public readonly module: PluginModule<any>,
      public readonly className: string,
      public readonly implementation: object,
   ) {
      this.module.onLoad.subscribe((loaded, symbol) => {
         const cls = symbol.publicSymbols.get(className);
         if (!cls || !(cls instanceof ConstructableSymbol)) throw new Error('not constructable');

         for (const [key, prop] of Object.entries(Object.getOwnPropertyDescriptors(implementation))) {
            const symbol = cls.prototypeFields.get(key);
            if (!(symbol instanceof InvocableSymbol)) throw new Error('not invocable');
            if (prop.get) {
               this.implGetSet(loaded, symbol, prop);
            } else {
               this.implMethod(key, symbol, prop, loaded);
            }
         }
      });
   }

   private implMethod(
      key: string,
      symbol: InvocableSymbol<unknown>,
      prop: PropertyDescriptor,
      loaded: PluginModuleLoaded,
   ) {
      if (key === 'constructor') {
         this.module.plugin.registerCallback(symbol, ctx => {
            // We use ctx.result here because ctx.thisObject is not a native handle
            // which results in different storages between constructor and methods
            prop.value.call(this.getThisValue(ctx.result!, ctx, loaded), ...ctx.params);
         });
      } else {
         this.module.plugin.registerCallback(symbol, ctx => {
            ctx.result = prop.value.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ...ctx.params);
         });
      }
   }

   private implGetSet(loaded: PluginModuleLoaded, symbol: InvocableSymbol<unknown>, { get, set }: PropertyDescriptor) {
      if (get) {
         this.module.plugin.registerCallback(symbol, ctx => {
            ctx.result = get.call(this.getThisValue(ctx.thisObject!, ctx, loaded));
         });
      }
      if (set) {
         this.module.plugin.registerCallback(symbol, ctx => {
            ctx.result = set.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ctx.params[0]);
         });
      }
   }

   protected getThisValue(
      native: unknown,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ): ThisContext<object, ModuleTypeMap> {
      return new ThisContext(invocation, native as object, this.implementation, loaded, this.module.plugin);
   }
}

export class ImplStatic extends Impl {}

export class ImplStorage<T extends object, Native extends object> extends Impl {
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
      this.moduleLoaded = loaded;
   }

   protected moduleLoaded?: PluginModuleLoaded;

   protected override getThisValue(
      native: object,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ) {
      if (!this.module.plugin.context.isNativeHandleInternal(native)) throw new Error('Not native');
      const t = new StorageThis(invocation, native, this.implementation, loaded, this.module.plugin);

      (t as Mutable<typeof t>).storage = this.module.plugin.getOrCreateStorage(native, () =>
         this.createStorage(native, loaded),
      );

      return t;
   }

   public get symbolLoaded() {
      if (!this.moduleLoaded) {
         throw new Error(
            `Unable to check for ${this.className} implemented by ${this.module.plugin.identifier}: module not loaded`,
         );
      }

      return !!this.moduleLoaded.tryResolve(this.className);
   }

   public tryCreate(partialStorage: Partial<T>): undefined | Native {
      if (!this.symbolLoaded) return;
      return this.create(partialStorage);
   }

   public create(partialStorage: Partial<T>): Native {
      if (!this.moduleLoaded) {
         throw new Error(
            `Unable to create ${this.className} implemented by ${this.module.plugin.identifier}: module not loaded`,
         );
      }

      const native = this.moduleLoaded.construct(this.className);
      const storage = this.createStorage(native, this.moduleLoaded);
      Object.assign(storage, partialStorage);
      this.module.plugin.bindStorageWithHandle(native, storage);
      return native;
   }
}
