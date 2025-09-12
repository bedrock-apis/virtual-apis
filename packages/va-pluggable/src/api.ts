import {
   ConstructableSymbol,
   ContextPlugin,
   ContextPluginLinkedStorage,
   InvocationInfo,
   ModuleSymbol,
} from '@bedrock-apis/virtual-apis';
import type * as mc from '@minecraft/server';

type ModuleTypeValue =
   | {
        new (...args: unknown[]): void;
        prototype: object;
     }
   | {
        prototype: object;
     }
   | Record<string, unknown>;

// TODO Figure out how to properly map types?
export type ServerModuleTypeMap = {
   [K in keyof typeof mc as (typeof mc)[K] extends ModuleTypeValue ? K : never]: (typeof mc)[K];
};

type PartialParts<B, ThisArg = B> = {
   [P in keyof B]?: B[P] extends (...param: infer param) => infer ret ? (this: ThisArg, ...param: param) => ret : B[P];
};

export abstract class Plugin extends ContextPlugin {
   protected onWarning(warning: unknown) {}
   protected onError(error: unknown) {}
   protected onPanic(panic: unknown) {}

   protected serverBeta = new PluginModuleImplementer<ServerModuleTypeMap>(this, '@minecraft/server', 'beta');

   protected getStorage<T extends object = object>(instance: object, storage: ContextPluginLinkedStorage<T>): T {
      return storage.get(instance);
   }

   public override onAfterModuleCompilation(module: ModuleSymbol): void {
      this.serverBeta.onAfterModuleCompilation(module);
   }

   protected getPlugin(plugin: typeof ContextPlugin) {
      this.context.getPlugin(plugin);
   }
}

interface CallThis<T, Mod extends ModuleTypeMap> {
   invocation: InvocationInfo;
   instance: object;
   implementation: T;
   module: PluginModuleImplementer<Mod>;
}

interface StorageThis<T, Mod extends ModuleTypeMap, Storage> extends CallThis<T, Mod> {
   storage: Storage;
}

type ConstructorImpl<This, Mod extends ModuleTypeMap, T extends keyof Mod> = Mod[T] extends new (
   ...args: infer T
) => unknown
   ? {
        // eslint-disable-next-line @typescript-eslint/no-misused-new
        constructor(this: This, ...args: T): void;
     }
   : object;

type ModuleTypeMap = Record<string, ModuleTypeValue>;

type Constructable = { prototype: object };

type Constructables<T extends ModuleTypeMap> = {
   [K in keyof T as T[K] extends Constructable ? K : never]: T[K] extends Constructable ? object : never;
};

export class PluginModuleImplementer<Mod extends ModuleTypeMap> {
   public constructor(
      public readonly plugin: Plugin,
      public readonly name: string,
      public readonly version: string,
   ) {}

   protected moduleSymbol?: ModuleSymbol;

   public implement<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T]['prototype'], CallThis<Mod[T]['prototype'], Mod>>,
   ) {
      new PluginImplementation(this as PluginModuleImplementer<ModuleTypeMap>, className as string, implementation);
   }
   public implementStatic<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T], CallThis<Mod[T], Mod>>,
   ) {
      new PluginStaticImpl(this, className as string, implementation);
   }
   public implementWithStorage<T extends keyof Mod, Storage extends object>(
      className: T,
      createStorage: (implementation: Mod[T]['prototype']) => Storage,
      implementation: PartialParts<Mod[T]['prototype'], StorageThis<Mod[T]['prototype'], Mod, Storage>> &
         ConstructorImpl<StorageThis<Mod[T]['prototype'], Mod, Storage>, Mod, T>,
   ) {
      type Native = Mod[T]['prototype'] extends object ? Mod[T]['prototype'] : never;

      return new PluginImplementationWithStorage<Storage, Native>(
         this,
         className as string,
         implementation,
         createStorage as unknown as (n: object) => Storage,
      );
   }

   public onAfterModuleCompilation(module: ModuleSymbol): void {
      if (module.name === this.name) {
         this.moduleSymbol = module;
         // TODO Version check
         this.onLoad?.();
      }
   }

   public resolve<T extends keyof Mod>(className: T) {
      if (!this.moduleSymbol) throw new Error(`Unable to resolve ${String(className)}: module is not loaded`);

      const symbol = this.moduleSymbol?.symbolsMap.get(String(className));
      if (!symbol) throw new Error(`Unable to resolve ${String(className)}: symbol not found`);

      return symbol.getRuntimeValue(this.plugin.context) as Mod[T];
   }

   public onLoad?: () => void;

   public construct<T extends keyof Constructables<Mod>>(className: T) {
      if (!this.moduleSymbol) throw new Error(`Unable to construct ${String(className)}: module is not loaded`);
      const symbol = this.moduleSymbol?.symbolsMap.get(String(className));

      if (!symbol) throw new Error(`Unable to construct ${String(className)}: symbol not found`);
      if (!(symbol instanceof ConstructableSymbol))
         throw new Error(`Unable to construct ${String(className)}: non constructable`);

      return symbol?.createRuntimeInstanceInternal(this.plugin.context) as Mod[T]['prototype'];
   }
}

export abstract class PluginWithConfig<Config extends object> extends Plugin {
   protected abstract config: Config;
   public configure(config: Config) {
      Object.assign(this.config ?? {}, config);
   }
}

export class PluginImplementation {
   public constructor(
      protected readonly module: PluginModuleImplementer<ModuleTypeMap>,
      protected readonly className: string,
      protected readonly implementation: object,
   ) {
      for (const [key, { value, set, get }] of Object.entries(Object.getOwnPropertyDescriptors(implementation))) {
         // TODO Implement setter

         if (get) {
            this.module.plugin.context.implement(this.getKey(key) + ' getter', ctx => {
               ctx.result = get.call(this.getThisValue(ctx.thisObject!, ctx));
            });
         } else {
            if (key === 'constructor') {
               this.module.plugin.context.implement(this.className, ctx => {
                  value.call(this.getThisValue(ctx.thisObject!, ctx), ...ctx.params);
               });
            } else {
               this.module.plugin.context.implement(this.getKey(key), ctx => {
                  ctx.result = value.call(this.getThisValue(ctx.thisObject!, ctx), ...ctx.params);
               });
            }
         }
      }
   }

   protected getKey(key: string) {
      return `${this.className}::${key}`;
   }

   protected getThisValue(native: unknown, invocation: InvocationInfo): CallThis<object, ModuleTypeMap> {
      return { invocation, module: this.module, implementation: this.implementation, instance: native as object };
   }
}

export class PluginStaticImpl extends PluginImplementation {
   protected override getKey(key: string): string {
      return super.getKey(key) + ' static';
   }
}

export class PluginImplementationWithStorage<T extends object, Native extends object> extends PluginImplementation {
   protected storage: ContextPluginLinkedStorage<T>;

   public constructor(
      module: PluginModuleImplementer<ModuleTypeMap>,
      className: string,
      implementation: object,
      createStorage: (n: object) => T,
   ) {
      super(module, className, implementation);
      this.storage = new ContextPluginLinkedStorage(createStorage);
   }

   protected override getThisValue(
      native: unknown,
      invocationInfo: InvocationInfo,
   ): StorageThis<object, ModuleTypeMap, T> {
      return { ...super.getThisValue(native, invocationInfo), storage: this.getStorage(native as Native) };
   }

   public getStorage(nativeObject: Native): T {
      return this.storage.get(nativeObject);
   }
}

/**
 * Adds properties to the provided object prototype
 *
 * Can override and modify properties
 */
/*
function overTakes<B>(prototype: B, object: PartialParts<B>): B {
   const prototypeOrigin = Kernel['globalThis::Object'].setPrototypeOf(
      Kernel['globalThis::Object'].defineProperties(
         {},
         Kernel['globalThis::Object'].getOwnPropertyDescriptors(prototype),
      ),
      Kernel['globalThis::Object'].getPrototypeOf(prototype),
   );
   Kernel['globalThis::Object'].setPrototypeOf(object, prototypeOrigin);
   Kernel['globalThis::Object'].defineProperties(
      prototype,
      Kernel['globalThis::Object'].getOwnPropertyDescriptors(object),
   );
   return prototypeOrigin;
}*/
