import { Kernel } from '@bedrock-apis/kernel-isolation';
import { ModuleContext } from '../module-context';
import { ClassAPISymbol } from './class';
import { APISymbol } from './symbol';

export class ObjectAPISymbol extends APISymbol {
   public constructor(
      context: ModuleContext,
      name: string,
      protected readonly objectTypeName: string,
   ) {
      super(context, name);
   }

   protected override compile(): object {
      const symbol = this.context.symbols.get(this.objectTypeName);
      if (!symbol)
         throw new Kernel['globalThis::ReferenceError'](`Unknown object type name symbol: ${this.objectTypeName}`);

      if (symbol instanceof ClassAPISymbol) {
         // TODO Idk which method to use
         return new symbol.api();
      } else return symbol.api;
   }
}
