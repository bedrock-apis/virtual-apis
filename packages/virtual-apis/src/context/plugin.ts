import type { ConstructableSymbol, ModuleSymbol, ObjectValueSymbol } from '../symbols';
import type { Context } from './context';
import type { PluginManager } from './plugin-manager';

export type ContextPluginType<T extends ContextPlugin> = {
   new (context: Context): T;
   readonly prototype: T;
};
export abstract class ContextPlugin {
   public constructor(public readonly context: Context) {
      this.manager = context.pluginManager;
   }
   public readonly manager: PluginManager;
   public readonly handleToStorage: WeakMap<object, object> = new WeakMap();
   public readonly storageToHandle: WeakMap<object, object> = new WeakMap();
   public abstract readonly identifier: string;
   public static instantiate<S extends ContextPlugin, T extends ContextPluginType<S>>(this: T, context: Context): S {
      return new this(context);
   }
   public static getInstance<S extends ContextPlugin, T extends ContextPluginType<S>>(this: T, context: Context): S {
      return context.pluginManager.plugin as S;
   }
   public onBeforeModuleCompilation(_: ModuleSymbol): void {}
   public onBeforeReady(): void {}
   public onAfterModuleCompilation(_: ModuleSymbol): void {}
   public onAfterReady(): void {}
   public onRegistration(): void {}
   public onDispose(): void {}
   public bindStorageWithObject(object: ObjectValueSymbol, storage: object): void {
      this.bindStorageWithHandle(object.getRuntimeValue(this.context), storage);
   }
   public bindStorageWithHandle(handle: object, storage: object): void {
      this.handleToStorage.set(handle, storage);
      this.storageToHandle.set(storage, handle);
   }
   public getCreateHandleFor(storage: object, fallback: ConstructableSymbol): object {
      let maybeHandle = this.storageToHandle.get(storage);
      if (!maybeHandle) {
         maybeHandle = fallback.createRuntimeInstanceInternal(this.context);
         this.bindStorageWithHandle(maybeHandle, storage);
      }
      return maybeHandle;
   }
   public getStorage(handle: object): object | null {
      return this.handleToStorage.get(handle) ?? null;
   }
   public dispose(storageOrHandle: object): boolean {
      if (this.storageToHandle.has(storageOrHandle)) {
         const handle = this.storageToHandle.get(storageOrHandle);
         this.storageToHandle.delete(storageOrHandle);
         this.handleToStorage.delete(handle!);
         return this.context.disposeHandleInternal(handle!);
      }
      if (this.handleToStorage.has(storageOrHandle)) {
         const storage = this.storageToHandle.get(storageOrHandle);
         this.storageToHandle.delete(storage!);
         this.handleToStorage.delete(storageOrHandle);
         return this.context.disposeHandleInternal(storageOrHandle);
      }
      return false;
   }
}
