import { ParamsDefinition, Type } from '../../type-validators';
import { createMethodFor } from '../factory';
import { ModuleContext } from '../module-context';
import { ClassAPISymbol } from './class';
import { APISymbol } from './symbol';

export class MethodAPISymbol extends APISymbol {
   public constructor(
      context: ModuleContext,
      name: string,
      protected readonly cls: ClassAPISymbol,
      protected readonly params: ParamsDefinition,
      protected readonly returnType: Type,
   ) {
      super(context, name);
      this.invocable(`${cls.name}::${name}`);
   }

   protected override compile(): object {
      return createMethodFor(this.cls, this.name, this.params, this.returnType);
   }
}
