import type { Context } from '../context/context';
import { CompilableSymbol, InvocableSymbol } from '../symbols/abstracts';
import { InterfaceSymbol } from './interface';

// Kernel Safe as its extracted in initialization before any plugins or addons code
const { defineProperty, create } = Object;
export class ModuleSymbol extends CompilableSymbol<object> {
   public readonly invocables = new Map<string, InvocableSymbol<unknown>>();
   public readonly symbols = new Map<string, CompilableSymbol<unknown>>();
   public readonly publicSymbols = new Map<string, CompilableSymbol<unknown>>();

   protected override compile(context: Context): object {
      // Pre compile, for correct order
      // For example interface is not exported value so its not considered as public symbol
      for (const symbol of this.symbols.values()) {
         symbol.getRuntimeValue(context);
         if (symbol instanceof InvocableSymbol) this.invocables.set(symbol.identifier, symbol);
      }

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

   public readonly metadata: { name: string; uuid: string; version: string } = { name: '', version: '', uuid: '' };
   public setMetadata(metadata: { name: string; uuid: string; version: string }) {
      this.setName(metadata.name);
      (this as Mutable<this>).metadata = metadata;
      (this as Mutable<this>).version = metadata.version;
      (this as Mutable<this>).nameVersion = `${metadata.name} ${metadata.version}`;
      return this;
   }
   public readonly version!: string;

   /** Name and version */
   public readonly nameVersion!: string;

   public addSymbol(symbol: CompilableSymbol<unknown>, isPublic: boolean) {
      this.symbols.set(symbol.name, symbol);

      if (!isPublic) return;
      if (this.publicSymbols.has(symbol.name))
         throw new ReferenceError(`Public symbol with name of '${symbol.name}' is already registered in this module`);
      this.publicSymbols.set(symbol.name, symbol);
   }
}
