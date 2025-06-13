import { Type } from '../../type-validators';
import { createPropertyHandler } from '../factory';
import { ModuleContext } from '../module-context';
import { ClassAPISymbol } from './class';
import { APISymbol } from './symbol';

type GetterCompiled = () => unknown;

export class GetterAPISymbol extends APISymbol<GetterCompiled> {
   public constructor(
      context: ModuleContext,
      name: string,
      protected readonly cls: ClassAPISymbol,
      protected readonly getterType: Type,
   ) {
      super(context, name);
      this.invocable(`${cls.name}::${name} getter`);
   }

   protected override compile(): GetterCompiled {
      return createPropertyHandler(this.cls, this.name, this.getterType, false);
   }
}
