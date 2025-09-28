import { MapWithDefaults, VirtualPrivilege } from '@bedrock-apis/va-common';
import { CompilableSymbol, InvocableSymbol } from '../symbols';
import { ModuleSymbol } from '../symbols/module';
import { ContextConfig } from './config';
import { ContextPlugin } from './plugin';

const { create } = Object;

export class Context implements Disposable {
   //#region Static
   private static contexts = new Map<number, Context>();
   private static runtimeIdIncrementalVariable = 0;
   public static getRuntimeModule(id: number, name: string) {
      const context = this.contexts.get(id);
      if (!context) throw new ReferenceError('No such a context found with this id: ' + context);
      const runtime = context.getModuleSymbol(name);
      if (!runtime) throw new ReferenceError('No such a module found with this name: ' + name);
      return runtime.getRuntimeValue(context);
   }
   public static wasLoadedAtLeastOnce = false;
   public static getContext(id: number) {
      return this.contexts.get(id);
   }
   //#endregion

   //#region Properties
   protected readonly nativeHandles: WeakSet<object> = new WeakSet();
   protected readonly modules = new MapWithDefaults<string, ModuleSymbol>();
   protected readonly runtimeId = Context.runtimeIdIncrementalVariable++;
   public readonly symbols: Map<string, CompilableSymbol<unknown>> = new Map();
   public readonly jsModules = new Map<string, string>();
   public currentPrivilege: string = VirtualPrivilege.None;
   public constructor() {
      Context.contexts.set(this.runtimeId, this);
   }
   public config: ContextConfig = {
      implementationEarlyExit: false,
   };
   //#endregion

   //#region APIs
   public setup(config: Partial<ContextConfig>): void {
      Object.assign(this.config, config);
   }

   public readonly plugin!: ContextPlugin;
   public use(pluginConstructor: new (context: Context) => ContextPlugin) {
      (this as Mutable<this>).plugin = new pluginConstructor(this);
      this.plugin.onRegistration();
   }
   public getRuntimeId(): number {
      return this.runtimeId;
   }
   public getModuleSymbol(name: string): ModuleSymbol | null {
      return this.modules.get(name) ?? null;
   }
   public getSymbolByUniqueName(name: string): CompilableSymbol<unknown> | null {
      return this.symbols.get(name) ?? null;
   }
   public deferPrivilege<T extends string>(privilege: T): Disposable {
      const before = this.currentPrivilege;
      this.currentPrivilege = privilege;
      return { [Symbol.dispose]: () => (this.currentPrivilege = before) };
   }
   //#endregion
   //#region Plugins
   /** @internal */
   public addModuleSymbolInternal(symbol: ModuleSymbol) {
      this.modules.set(symbol.name, symbol);
   }

   /** @internal */
   public isNativeHandleInternal(value: unknown): boolean {
      //Returns if the value is native handle to the native class or not
      return this.nativeHandles.has(value as object);
   }
   /** @internal */
   public createHandleInternal(): object {
      const handle = create(null);
      this.nativeHandles.add(handle);
      return handle;
   }
   /** @internal */
   public disposeHandleInternal(handle: object): boolean {
      return this.nativeHandles.delete(handle);
   }
   protected compileModuleInternal(m: ModuleSymbol) {
      this.plugin.onBeforeModuleCompilation(m);
      m.getRuntimeValue(this);
      for (const symbol of m.symbols.values()) {
         const key = `${m.name}::${(symbol as InvocableSymbol<unknown>).identifier ?? symbol.name}`;
         if (this.symbols.has(key)) throw Error('Undefined behavior all keys must be unique, ' + key);

         this.symbols.set(key, symbol);
      }
      this.plugin.onAfterModuleCompilation(m);
   }

   public ready() {
      this.plugin.onBeforeReady();
      for (const m of this.modules.values()) this.compileModuleInternal(m);
      this.plugin.onAfterReady();
   }
   protected dispose(): void {
      Context.contexts.delete(this.runtimeId);
      this.plugin.onDispose();
   }
   //Internal IDisposable
   public [Symbol.dispose](): void {
      this.dispose();
   }
}

export class ContextUtils {
   public static getStats(context: Context, mSymbol: ModuleSymbol) {
      const inv = new Set(mSymbol.invocables.values());
      const is = new Set(context.plugin.implementations.keys()).intersection(inv);
      return {
         text: `${is.size}/${inv.size} (${((is.size / inv.size) * 100).toFixed(2)}%)`,
         implementedSymbols: is
            .values()
            .map(e => e.identifier ?? e.name)
            .toArray(),
         implementableSymbols: inv
            .values()
            .map(e => e.identifier ?? e.name)
            .toArray(),
         nonImplementedSymbols: inv.difference(is).values().toArray(),
      };
   }
}

/*
   public implement(moduleNameVersion: string, identifier: string, impl: SymbolCallback, priority = 0) {
      const is = this.implementations
         .getOrCreate(moduleNameVersion, () => new MapWithDefaults())
         .getOrCreate(identifier, () => []);

      is.push({ impl, priority });
      is.sort((a, b) => b.priority - a.priority);
   }*/

/*
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
   }*/
