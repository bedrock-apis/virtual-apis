import type { Context } from '../context/base';
import { CompilableSymbol } from '../symbols/abstracts';
import { InterfaceSymbol } from './interface';

// Kernel Safe as its extracted in initialization before any plugins or addons code
const { defineProperty, create } = Object;
export class ModuleSymbol extends CompilableSymbol<object> {
   public readonly symbols: Set<CompilableSymbol<unknown>> = new Set();
   public readonly symbolsMap: Map<string, CompilableSymbol<unknown>> = new Map();
   public metadata: { name: string; uuid: string; version: string } = { name: '', version: '', uuid: '' };
   public readonly publicSymbols: Map<string, CompilableSymbol<unknown>> = new Map();
   protected override compile(context: Context): object {
      context.onBeforeModuleCompilation(this);
      // Pre compile, for correct order
      // For example interface is not exported value so its not considered as public symbol
      for (const symbol of this.symbols.values()) symbol.getRuntimeValue(context);

      const moduleObject = create(null);
      for (const symbol of this.publicSymbols.values())
         if (!(symbol instanceof InterfaceSymbol))
            defineProperty(moduleObject, symbol.name, {
               configurable: false,
               writable: false,
               enumerable: true,
               value: symbol.getRuntimeValue(context),
            });

      return moduleObject;
   }
   public addSymbol(symbol: CompilableSymbol<unknown>, isPublic: boolean) {
      this.symbols.add(symbol);
      this.symbolsMap.set(symbol.name, symbol);
      if (!isPublic) return;
      if (this.publicSymbols.has(symbol.name))
         throw new ReferenceError(`Public symbol with name of '${symbol.name}' is already registered in this module`);
      this.publicSymbols.set(symbol.name, symbol);
   }
}
