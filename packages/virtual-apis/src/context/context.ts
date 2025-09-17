import { VirtualPrivilege } from '@bedrock-apis/va-binary';
import { compareVersions, d, MapWithDefaults } from '@bedrock-apis/va-common';
import { ErrorFactory, PANIC_ERROR_MESSAGES, ReportAsIs } from '../errorable';
import { CompilableSymbol, InvocableSymbol } from '../symbols';
import { ModuleSymbol } from '../symbols/module';
import { ContextConfig } from './config';
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
      Context.contexts.set(this.runtimeId, this);
   }

   public currentPrivilege = VirtualPrivilege.None;

   public temporaryPrivilege(privilege: VirtualPrivilege): Disposable {
      const before = this.currentPrivilege;
      this.currentPrivilege = privilege;
      return { [Symbol.dispose]: () => (this.currentPrivilege = before) };
   }

   protected readonly plugins = new Map<string, ContextPlugin>();
   protected readonly pluginTypes = new Map<typeof ContextPlugin, ContextPlugin>();

   /** @internal */
   public registerModule(symbol: ModuleSymbol) {
      symbol.getRuntimeValue(this);
      const list = this.modules.getOrCreate(symbol.name, () => []);
      list.push(symbol);
      list.sort((a, b) => compareVersions(b.version, a.version));
   }
   public getModuleSymbols(specifier: string) {
      const moduleSymbols: ModuleSymbol[] = [];
      for (const [name, versions] of this.modules.entries()) {
         for (const originalSymbol of versions) {
            if (name !== specifier && name !== specifier + '-bindings') continue;

            // Prefer bindings over regular modules
            const binding = this.modules.get(name + '-bindings')?.[0];
            const symbol = binding ?? originalSymbol;

            if (moduleSymbols.some(e => e === symbol)) continue;
            moduleSymbols.push(symbol);
         }
      }
      return moduleSymbols;
   }
   protected readonly modules = new MapWithDefaults<string, ModuleSymbol[]>();
   public readonly symbols: Map<string, CompilableSymbol<unknown>> = new Map();

   /** Map of js module name to js code, used for bindings */
   public jsModules = new Map<string, string>();

   protected registerPlugin<T extends typeof ContextPlugin>(pluginType: T): InstanceType<T> {
      const loaded = this.tryGetPlugin(pluginType);
      if (loaded) return loaded;

      const plugin = pluginType.instantiate(this);
      this.plugins.set(pluginType.identifier, plugin);
      this.pluginTypes.set(pluginType, plugin);
      plugin.onInitialization();
      return plugin as InstanceType<T>;
   }

   public tryGetPlugin<T extends typeof ContextPlugin>(plugin: T) {
      return this.pluginTypes.get(plugin) as InstanceType<T> | undefined;
   }
   public getPlugin<T extends typeof ContextPlugin>(pluginType: T, requiredFor = 'context') {
      const plugin = this.tryGetPlugin(pluginType);
      if (!plugin) {
         if (this.config.disablePlugins.includes(pluginType)) {
            throw new Error(`${pluginType.name} was disabled but is required for ${requiredFor}`);
         } else {
            throw new Error(`${pluginType.name} is required for ${requiredFor}`);
         }
      }
      return plugin;
   }

   public config: ContextConfig = {
      implementationEarlyExit: false,
      disablePlugins: [],
   };

   public configureAndLoadPlugins(config: Partial<ContextConfig>) {
      d('[Context] configured, loading plugins...');

      Context.wasLoadedAtLeastOnce = true;

      Object.assign(this.config, config);

      for (const plugin of ContextPlugin.plugins.values()) {
         if (this.config.disablePlugins.includes(plugin)) continue;
         this.registerPlugin(plugin);
      }
   }

   public getStats(moduleName: string) {
      const mod = this.onModuleRequested(moduleName);
      const impls = this.implementations.get(mod.nameVersion)!;
      return {
         text: `${impls.size}/${mod.invocables.size} (${((impls.size / mod.invocables.size) * 100).toFixed(2)}%)`,
         implementedSymbols: [...impls.keys()],
         implementableSymbols: [...mod.invocables.keys()],
         nonImplementedSymbols: [...new Set(mod.invocables.keys()).difference(new Set(impls.keys()))],
      };
   }

   //#region NativeHandles
   /** @internal */
   public readonly nativeHandles: WeakSet<object> = new WeakSet();
   /** @internal */
   public isNativeHandle(value: unknown): boolean {
      //Returns if the value is native handle to the native class or not
      return this.nativeHandles.has(value as object);
   }
   /** @internal */
   public createNativeHandle(): object {
      const handle = create(null);
      this.nativeHandles.add(handle);
      return handle;
   }

   //#endregion

   //#region Actions
   /** @internal */
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

   /** @internal */
   public onModulesLoaded() {
      d('[Context] Emitting onModulesLoaded on plugins');
      for (const plugin of this.plugins.values()) plugin.onModulesLoaded();
   }
   /** @internal */
   public onBeforeModuleCompilation(moduleSymbol: ModuleSymbol): void {
      for (const plugin of this.plugins.values()) plugin.onBeforeModuleCompilation(moduleSymbol);
   }
   /** @internal */
   public onModuleRequested(name: string): ModuleSymbol {
      const module = this.modules.get(name)?.[0];
      if (!module) throw new ReferenceError(`Module ${name} is not registered in context with id ${this.runtimeId}`);
      return module;
   }

   public implement(moduleNameVersion: string, identifier: string, impl: SymbolImpl, priority = 0) {
      const impls = this.implementations
         .getOrCreate(moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(identifier, () => []);

      impls.push({ impl, priority });
      impls.sort((a, b) => b.priority - a.priority);
   }

   /** @internal */
   public implementations = new MapWithDefaults<
      string,
      MapWithDefaults<string, { impl: SymbolImpl; priority: number }[]>
   >();

   /** @internal */
   public onInvocation(invocation: InvocationInfo) {
      const implemetations = this.implementations
         .get(invocation.symbol.module.nameVersion)
         ?.get(invocation.symbol.identifier);

      if (!implemetations?.length) {
         invocation.diagnostics.errors.report(
            new ErrorFactory(PANIC_ERROR_MESSAGES.NoImplementation(invocation.symbol.identifier)),
         );
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
   /** @internal */
   protected dispose(): void {
      Context.contexts.delete(this.runtimeId);
      (this as Mutable<this>).nativeHandles = new WeakSet();
      for (const plugin of this.plugins.values()) plugin.onDispose();
   }
}
