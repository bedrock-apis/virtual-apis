import { MapWithDefaults } from '@bedrock-apis/va-common';
import { ErrorFactory, PANIC_ERROR_MESSAGES, ReportAsIs } from '../errorable';
import { InvocableSymbol, type ModuleSymbol } from '../symbols';
import { Context } from './context';
import { InvocationInfo } from './invocation-info';
import { ContextPlugin } from './plugin';

export type SymbolCallback = (ctx: InvocationInfo) => void;
export class PluginManager {
   public readonly plugin: ContextPlugin | null = null;
   public readonly implementations = new MapWithDefaults<InvocableSymbol<unknown>, SymbolCallback[]>();
   public constructor(public readonly context: Context) {}

   // Anyone can invoke the callbacks but in most cases its from user addon context
   public invoke(invocation: InvocationInfo) {
      const callbacks = this.implementations.get(invocation.symbol);

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
   public use<T extends typeof ContextPlugin & { new (context: Context): ContextPlugin }>(plugin: T) {
      const instance = plugin.instantiate(this.context);
      (this as Mutable<this>).plugin = instance;
      instance.onRegistration();
   }
   public registerCallback(symbol: InvocableSymbol<unknown>, impl: SymbolCallback): void {
      this.implementations.getOrCreate(symbol, () => []).push(impl);
   }

   /** @internal */
   public onAfterModuleCompilation(moduleSymbol: ModuleSymbol): void {
      this.plugin?.onAfterModuleCompilation(moduleSymbol);
   }
   /**
    * Internal Action
    *
    * @internal
    */
   public onBeforeModuleCompilation(moduleSymbol: ModuleSymbol): void {
      this.plugin?.onBeforeModuleCompilation(moduleSymbol);
   }
   /**
    * Internal Action
    *
    * @internal
    */
   public onAfterReady() {
      this.plugin?.onAfterReady();
      for (const symbol of this.implementations.keys()) {
         if (symbol instanceof InvocableSymbol)
            // Do we want to call warn? We should have some events for this scenario, console methods should not be used in libraries
            console.warn(
               'Registered callback that is not bound to invocable symbol, callback never triggers, symbol: ' +
                  (symbol.identifier ?? symbol.name ?? 'Unknown'),
            );
      }
   }
   /**
    * Internal Action
    *
    * @internal
    */
   public onBeforeReady() {
      this.plugin?.onBeforeReady();
   }
   /**
    * This is called from context, you better not call dispose on your own
    *
    * @internal
    */
   public dispose() {
      this.plugin?.onDispose();
   }
}
