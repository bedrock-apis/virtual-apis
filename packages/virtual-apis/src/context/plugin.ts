import { MapWithDefaults } from '@bedrock-apis/va-common';
import { ErrorFactory, PANIC_ERROR_MESSAGES, ReportAsIs } from '../errorable';
import { ConstructableSymbol, InvocableSymbol, ModuleSymbol } from '../symbols';
import type { Context } from './context';
import { InvocationInfo } from './invocation-info';
export type SymbolCallback = (ctx: InvocationInfo) => void;

export type ContextPluginType<T extends ContextPlugin> = {
   new (context: Context): T;
   readonly prototype: T;
};
export abstract class ContextPlugin {
   public constructor(public readonly context: Context) {}
   public readonly handleToStorage: WeakMap<object, object> = new WeakMap();
   public readonly storageToHandle: WeakMap<object, object> = new WeakMap();
   public abstract readonly identifier: string;
   public static instantiate<S extends ContextPlugin, T extends ContextPluginType<S>>(this: T, context: Context): S {
      return new this(context);
   }
   public static getInstance<S extends ContextPlugin, T extends ContextPluginType<S>>(this: T, context: Context): S {
      return context.plugin as S;
   }
   public onBeforeModuleCompilation(_: ModuleSymbol): void {}
   public onBeforeReady(): void {}
   public onAfterModuleCompilation(_: ModuleSymbol): void {}
   public onAfterReady(): void {}
   public onRegistration(): void {}
   public onDispose(): void {}

   public bindStorageWithHandle(handle: object, storage: object): void {
      this.handleToStorage.set(handle, storage);
      this.storageToHandle.set(storage, handle);
   }
   public getCreateHandleFor(storage: object, fallback: ConstructableSymbol): object {
      let handle = this.storageToHandle.get(storage);
      if (!handle) {
         handle = fallback.createRuntimeInstanceInternal(this.context);
         this.bindStorageWithHandle(handle, storage);
      }
      return handle;
   }
   public getStorage(handle: object): object | undefined {
      return this.handleToStorage.get(handle);
   }

   public readonly implementations = new MapWithDefaults<InvocableSymbol<unknown>, SymbolCallback[]>();

   protected getImplementations(invocation: InvocationInfo) {
      return this.implementations.get(invocation.symbol);
   }

   // Anyone can invoke the callbacks but in most cases its from user addon context
   public invoke(invocation: InvocationInfo) {
      const callbacks = this.getImplementations(invocation);

      if (!callbacks?.length) {
         invocation.diagnostics.errors.report(
            new ErrorFactory(PANIC_ERROR_MESSAGES.NoImplementation(invocation.symbol.identifier)),
         );
         return;
      }

      for (let i = 0; i < callbacks.length; i++) {
         const callback = callbacks[i];
         try {
            callback?.(invocation);
         } catch (error) {
            invocation.diagnostics.errors.report(new ReportAsIs(error as Error));
         }
      }
   }

   public getInvocableSymbolFor(keyname: string): InvocableSymbol<unknown> | null {
      const symbol = this.context.symbols.get(keyname);
      if (symbol instanceof InvocableSymbol) return symbol;
      return null;
   }

   public registerCallback(symbol: InvocableSymbol<unknown>, impl: SymbolCallback): void {
      this.implementations.getOrCreate(symbol, () => []).push(impl);
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
