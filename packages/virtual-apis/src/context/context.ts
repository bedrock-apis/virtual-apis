import { VirtualPrivilege } from '@bedrock-apis/binary';
import { MapWithDefaults } from '@bedrock-apis/common';
import { ErrorFactory, PANIC_ERROR_MESSAGES, ReportAsIs } from '../errorable';
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

   public currentPrivilege = VirtualPrivilege.None;

   public readonly plugins = new Map<string, ContextPlugin>();
   protected readonly pluginTypes = new Map<typeof ContextPlugin, ContextPlugin>();

   public readonly modules: Map<string, ModuleSymbol> = new Map();
   public readonly symbols: Map<string, CompilableSymbol<unknown>> = new Map();
   public tryGetSymbolByIdentifier(id: string): CompilableSymbol<unknown> | null {
      return this.symbols.get(id) ?? null;
   }
   public registerPlugin<T extends typeof ContextPlugin>(pluginType: T): InstanceType<T> {
      const plugin = pluginType.instantiate(this);
      this.plugins.set(pluginType.identifier, plugin);
      this.pluginTypes.set(pluginType, plugin);
      plugin.onInitialization();
      return plugin as InstanceType<T>;
   }
   public getPlugin<T extends typeof ContextPlugin>(plugin: T) {
      return this.pluginTypes.get(plugin) as InstanceType<T> | undefined;
   }
   public getPluginForce<T extends typeof ContextPlugin>(plugin: T, ctx: InvocationInfo) {
      const instance = this.getPlugin(plugin);
      if (!instance) throw new Error(`${plugin.name} is required for ${ctx.symbol.identifier ?? ctx.symbol.name}`);
      return instance;
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
      for (const symbol of moduleSymbol.symbols.values()) {
         this.symbols.set(
            `${moduleSymbol.name}::${(symbol as InvocableSymbol<unknown>).identifier ?? symbol.name}`,
            symbol,
         );
      }
      for (const plugin of this.plugins.values()) plugin.onAfterModuleCompilation(moduleSymbol);
      for (const [versionId, version] of this.implementations.entries()) {
         for (const impl of version.keys()) {
            if (!moduleSymbol.invocables.has(impl)) console.warn('Unknown invocable id', versionId, impl);
         }
      }
   }

   public onModulesLoaded() {
      for (const plugin of this.plugins.values()) plugin.onModulesLoaded();
   }
   public onBeforeModuleCompilation(moduleSymbol: ModuleSymbol): void {
      for (const plugin of this.plugins.values()) plugin.onBeforeModuleCompilation(moduleSymbol);
   }
   public onModuleRequested(name: string): ModuleSymbol {
      const module = this.modules.get(name);
      if (!module) throw new ReferenceError(`Module ${name} is not registered in context with id ${this.runtimeId}`);
      return module;
   }

   public implement(moduleNameVersion: string, identifier: string, impl: SymbolImpl, priority = 0) {
      const impls = this.implementations
         .getOrCreate(moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(identifier, () => []);

      if ((impls[0]?.priority ?? 0) <= priority) {
         impls.unshift({ impl, priority });
      } else {
         impls.push({ impl, priority });
      }
   }

   protected implementations = new MapWithDefaults<
      string,
      MapWithDefaults<string, { impl: SymbolImpl; priority: number }[]>
   >();

   public onInvocation(invocation: InvocationInfo) {
      const implemetations = this.implementations
         .get(invocation.symbol.module.nameVersion)
         ?.get(invocation.symbol.identifier);

      if (!implemetations?.length) {
         // TODO Config to ignore? Default implementation?
         invocation.diagnostics.errors.report(new ErrorFactory(PANIC_ERROR_MESSAGES.NoImplementation));
         return;
      }

      for (const { impl } of implemetations) {
         try {
            impl(invocation, ...invocation.params);
         } catch (error) {
            invocation.diagnostics.errors.report(new ReportAsIs(error as Error));
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
