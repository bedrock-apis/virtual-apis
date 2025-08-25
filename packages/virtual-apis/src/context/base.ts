import { CompilableSymbol, InvocableSymbol } from '../symbols';
import { ModuleSymbol } from '../symbols/module';
import { InvocationInfo } from './invocation-info';
import { PluginContext } from './plugin';

const { create } = Object;

export class Context implements Disposable {
   //#region Static
   private static contexts = new Map<number, Context>();
   private static runtimeIdIncrementalVariable = 0;
   public static getRuntimeModule(id: number, name: string) {
      const context = this.contexts.get(id);
      if (!context) throw new ReferenceError('No such a context found with this id: ' + context);
      return context.onModuleRequested(name);
   }
   //#endregion

   public readonly runtimeId = Context.runtimeIdIncrementalVariable++;
   public constructor() {
      Context.contexts.set(this.runtimeId, this);
   }

   public readonly plugins: Set<PluginContext> = new Set();
   public readonly modules: Map<string, ModuleSymbol> = new Map();
   public readonly symbols: Map<string, CompilableSymbol<unknown>> = new Map();
   public registerPlugin(plugin: PluginContext) {
      this.plugins.add(plugin);
      plugin.onContextInitialization(this);
      // Register all the methods on this context
   }

   //#region NativeHandles
   public readonly nativeHandles: WeakSet<object> = new WeakSet();
   public isNativeHandle(value: unknown): boolean {
      //Returns if the value is native handle to the native class or not
      return this.nativeHandles.has(value as object);
   }
   public createNativeHandle(): object {
      const handle = create(null);
      this.nativeHandles.add(handle);
      return handle;
   }

   public objectBindToHandleInternal(handle: object, isObjectConstant: string) {
      // Here it runs the binding
   }
   //#endregion

   //#region Actions
   public onAfterModuleCompilation(moduleSymbol: ModuleSymbol): void {
      // Register symbols
      for (const symbol of moduleSymbol.symbols) {
         this.symbols.set(
            `${moduleSymbol.name}::${(symbol as InvocableSymbol<unknown>).identifier ?? symbol.name}`,
            symbol,
         );
      }
      for (const plugin of this.plugins) plugin.onAfterModuleCompilation(this, moduleSymbol);
   }
   public onBeforeModuleCompilation(moduleSymbol: ModuleSymbol): void {
      for (const plugin of this.plugins) plugin.onBeforeModuleCompilation(this, moduleSymbol);
   }
   public onModuleRequested(name: string): ModuleSymbol {
      const module = this.modules.get(name);
      if (!module)
         throw new ReferenceError(
            'No such a module registered in current context, contextId: ' + this.runtimeId + ' moduleName: ' + name,
         );
      return module;
   }
   public onInvocation(invocationInfo: InvocationInfo) {
      //invocationInfo.symbol.identifier;
   }
   //#endregion

   //Internal IDisposable
   public [Symbol.dispose](): void {
      this.dispose();
   }
   public dispose(): void {
      Context.contexts.delete(this.runtimeId);
      (this as Mutable<this>).nativeHandles = new WeakSet();
      for (const plugin of this.plugins) plugin.onContextDispose(this);
   }
}
