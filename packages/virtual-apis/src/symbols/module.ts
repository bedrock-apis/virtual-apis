import type { Context } from '../context/base';
import { CompilableSymbol } from '../symbols/general';

// Kernel Safe as its extracted in initialization before any plugins or addons code
const { defineProperty, create } = Object;
export class ModuleSymbol extends CompilableSymbol<object> {
   public readonly symbols: Set<CompilableSymbol<unknown>> = new Set();
   public readonly publicSymbols: Map<string, CompilableSymbol<unknown>> = new Map();
   protected override compile(context: Context): object {
      //Pre compile, for correct order
      for (const symbol of this.symbols.values()) symbol.getRuntimeValue(context);

      const moduleObject = create(null);
      for (const key of this.publicSymbols.keys())
         defineProperty(moduleObject, key, {
            configurable: false,
            writable: false,
            enumerable: true,
            value: this.publicSymbols.get(key)!.getRuntimeValue(context),
         });

      return moduleObject;
   }
   public addSymbol(symbol: CompilableSymbol<unknown>, isPublic: boolean) {
      this.symbols.add(symbol);
      if (!isPublic) return;
      if (this.publicSymbols.has(symbol.name))
         throw new ReferenceError(`Public symbol with name of '${symbol.name}' is already registered in this module`);
      this.publicSymbols.set(symbol.name, symbol);
   }
}
