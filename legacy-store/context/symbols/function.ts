import { ParamsDefinition, Type } from '../../type-validators';
import { ModuleContext } from '../module-context';
import { APISymbol } from './symbol';

export class FunctionAPISymbol extends APISymbol {
   public constructor(
      context: ModuleContext,
      name: string,
      params: ParamsDefinition,
      returnType: Type,
      // TODO Figure out privilege types
      privilege: number[],
   ) {
      super(context, name);
   }

   protected override compile(): object {
      return {};
   }
}
