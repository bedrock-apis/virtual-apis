import { ErrorFactory, PANIC_ERROR_MESSAGES } from '../errorable';
import { CompilableSymbol, InvocableSymbol } from '../symbols';
import { ModuleSymbol } from '../symbols/module';
import { InvocationInfo } from './invocation-info';
import { ContextPlugin } from './plugin';

const { create } = Object;

type SymbolImpl = (ctx: InvocationInfo, ...args: unknown[]) => void;

export class Context implements Disposable {
   //#region Static
   private static contexts = new Map<number, Context>();
   private static runtimeIdIncrementalVariable = 0;
   public static getRuntimeModule(id: number, name: string) {
      const context = this.contexts.get(id);
      if (!context) throw new ReferenceError('No such a context found with this id: ' + context);
      return context.onModuleRequested(name).getRuntimeValue(context);
   }
   public static wasLoadedAtLeastOnce = false;
   public static getContext(id: number) {
      return this.contexts.get(id);
   }
   //#endregion

   public readonly runtimeId = Context.runtimeIdIncrementalVariable++;
   public constructor() {
      Context.wasLoadedAtLeastOnce = true;
      Context.contexts.set(this.runtimeId, this);

      // TODO Some kind of config to filter out unneded plugins
      for (const plugin of ContextPlugin.plugins.values()) {
         this.registerPlugin(plugin);
      }
   }

   public readonly plugins = new Map<string, ContextPlugin>();
   protected readonly pluginTypes = new Map<typeof ContextPlugin, ContextPlugin>();
   public readonly modules: Map<string, ModuleSymbol> = new Map();
   public readonly symbols: Map<string, CompilableSymbol<unknown>> = new Map();
   public tryGetSymbolByIdentifier(id: string): CompilableSymbol<unknown> | null {
      return this.symbols.get(id) ?? null;
   }
   public registerPlugin(pluginType: typeof ContextPlugin) {
      const plugin = pluginType.instantiate(this);
      this.plugins.set(pluginType.identifier, plugin);
      this.pluginTypes.set(pluginType, plugin);
      plugin.onInitialization();
   }
   public getPlugin<T extends typeof ContextPlugin>(plugin: T) {
      return this.pluginTypes.get(plugin) as InstanceType<T> | undefined;
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
      for (const plugin of this.plugins.values()) plugin.onAfterModuleCompilation(moduleSymbol);
      for (const [impl] of this.implementations.entries()) {
         if (!moduleSymbol.invocables.has(impl)) console.warn('Unknown invocable id', impl);
      }
   }
   public onBeforeModuleCompilation(moduleSymbol: ModuleSymbol): void {
      for (const plugin of this.plugins.values()) plugin.onBeforeModuleCompilation(moduleSymbol);
   }
   public onModuleRequested(name: string): ModuleSymbol {
      const module = this.modules.get(name);
      if (!module) throw new ReferenceError(`Module ${name} is not registered in context with id ${this.runtimeId}`);
      return module;
   }

   // TODO Check symbol/impl version?
   // TODO Priority system?
   public implement(identifier: string, impl: SymbolImpl) {
      let impls = this.implementations.get(identifier);
      if (!impls) this.implementations.set(identifier, (impls = []));
      impls.push(impl);
   }

   protected implementations = new Map<string, SymbolImpl[]>();

   public onInvocation(invocationInfo: InvocationInfo) {
      const implemetations = this.implementations.get(invocationInfo.symbol.identifier);
      if (!implemetations?.length) {
         // TODO Config to ignore? Default implementation?
         invocationInfo.diagnostics.errors.report(new ErrorFactory(PANIC_ERROR_MESSAGES.NoImplementation));
         return;
      }

      for (const implementation of implemetations) {
         try {
            implementation(invocationInfo, ...invocationInfo.params);
         } catch (error) {
            // TODO Catch by plugin? Config to stop here?
            invocationInfo.diagnostics.errors.report(new ErrorFactory((error as Error).stack));
         }
      }
   }
   //#endregion

   //Internal IDisposable
   public [Symbol.dispose](): void {
      this.dispose();
   }
   public dispose(): void {
      Context.contexts.delete(this.runtimeId);
      (this as Mutable<this>).nativeHandles = new WeakSet();
      for (const plugin of this.plugins.values()) plugin.onDispose();
   }
}
