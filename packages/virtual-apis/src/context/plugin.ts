import { ConstructableSymbol, type ModuleSymbol, type ObjectValueSymbol } from '../symbols';
import type { Context } from './base';

// It's not Symbol(Symbol.vaIdentifier), bc it's not assigned to Symbol constructor it self
export const vaTypeIdentifier: unique symbol = Symbol('Symbol(vaTypeIdentifier)');
export const vaIdentifier: unique symbol = Symbol('Symbol(vaIdentifier)');
export interface PluginInstanceStorageLike {
   [vaTypeIdentifier]?(): string;
   [vaIdentifier]?(): string;
}

// Low level plugin system
export abstract class ContextPlugin {
   public static instantiate<T extends new (context: Context) => S, S extends ContextPlugin>(
      this: T,
      context: Context,
   ): S {
      return new this(context);
   }
   protected constructor(public readonly context: Context) {}
   public abstract readonly identifier: string;
   // It's private we don't want a plugin to have direct access
   private readonly bindings: WeakMap<object, object> = new WeakMap<object, object>();
   private readonly bindingsInverted: WeakMap<object, object> = new WeakMap<object, object>();
   //
   public onBeforeModuleCompilation(module: ModuleSymbol): void {}
   public onAfterModuleCompilation(module: ModuleSymbol): void {}
   public getStaticInstanceBinding(symbol: ObjectValueSymbol): object | null {
      return null;
   }
   public onInitialization(): void {}
   public onDispose(): void {}
   public bindInstanceTo(handle: object, instance: object): void {
      this.bindings.set(handle, instance);
      this.bindingsInverted.set(instance, handle);
   }
   public tryGetHandleFor(instance: object): object | null {
      return this.bindingsInverted.get(instance) ?? null;
   }
   public tryGetInstanceFor(handle: object): object | null {
      return this.bindings.get(handle) ?? null;
   }
   public disposeHandle(handle: object): void {
      const instance = this.bindings.get(handle);
      this.bindings.delete(handle);
      if (instance) this.bindingsInverted.delete(instance);
   }
   public resolveHandleFor(instance: object, ctor?: string): object {
      const $ = this.tryGetHandleFor(instance);
      if ($) return $;
      const id = (instance as PluginInstanceStorageLike)[vaTypeIdentifier]?.() ?? ctor;
      if (!id) throw new ReferenceError('Failed to resolve type of the storage instance');
      const symbol = this.context.tryGetSymbolByIdentifier(id);
      if (!symbol) throw new ReferenceError('Failed to resolve type of the storage instance, id of ' + id);
      if (!(symbol instanceof ConstructableSymbol)) throw new ReferenceError('Symbol type must by class like symbol');
      const handle = symbol.createHandleInternal(this.context);
      this.bindInstanceTo(handle, instance);
      return handle;
   }
}
