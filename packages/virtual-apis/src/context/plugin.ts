import { d } from '@bedrock-apis/common';
import { type ModuleSymbol, type ObjectValueSymbol } from '../symbols';
import { Context } from './context';

// It's not Symbol(Symbol.vaIdentifier), bc it's not assigned to Symbol constructor it self
export const vaTypeIdentifier: unique symbol = Symbol('Symbol(vaTypeIdentifier)');
export const vaIdentifier: unique symbol = Symbol('Symbol(vaIdentifier)');
export interface PluginInstanceStorageLike {
   [vaTypeIdentifier]?(): string;
   [vaIdentifier]?(): string;
}

export class ContextPluginLinkedStorage<T extends object> {
   private readonly storages = new WeakMap<object, T>();
   protected readonly instances = new WeakMap<T, WeakRef<object>>();

   public constructor(protected readonly createStorage: (instance: object) => T) {}

   public get(instance: object) {
      const storage = this.storages.get(instance);
      if (storage) return storage;
      return this.create(instance);
   }

   public create(instance: object) {
      const createdStorage = this.createStorage(instance);
      this.storages.set(instance, createdStorage);
      this.instances.set(createdStorage, new WeakRef(instance));
      return createdStorage;
   }

   public getInstance(storage: T) {
      return this.instances.get(storage)?.deref();
   }
}

// Low level plugin system
export abstract class ContextPlugin {
   public static instantiate<T extends typeof ContextPlugin, S extends ContextPlugin>(this: T, context: Context): S {
      // @ts-expect-error Abstract bypass
      return new this(context);
   }
   public static plugins = new Map<string, typeof ContextPlugin>();
   public static identifier: string;
   public static register(identifier: string) {
      d('[ContextPlugin] Register', identifier);
      if (Context.wasLoadedAtLeastOnce) {
         console.warn(
            'Plugin',
            identifier,
            'wont be loaded by all contexts because some of them have already been initialized. Plugin loading should happen before context loading',
         );
      }
      this.identifier = identifier;
      this.prototype.identifier = identifier;
      this.plugins.set(this.prototype.identifier, this);
   }
   public constructor(public readonly context: Context) {}
   public identifier!: string;
   //
   public onBeforeModuleCompilation(module: ModuleSymbol): void {}
   public onAfterModuleCompilation(module: ModuleSymbol): void {}
   public onModulesLoaded(): void {}
   public getStaticInstanceBinding(symbol: ObjectValueSymbol): object | null {
      return null;
   }
   public onInitialization(): void {}
   public onDispose(): void {}
}
