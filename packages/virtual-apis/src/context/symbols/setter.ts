import { Type } from '../../type-validators';
import { createPropertyHandler } from '../factory';
import { ModuleContext } from '../module-context';
import { ClassAPISymbol } from './class';
import { APISymbol } from './symbol';

type SetterCompiled = (n: unknown) => void;

export class SetterAPISymbol extends APISymbol<SetterCompiled> {
   public constructor(
      context: ModuleContext,
      name: string,
      protected readonly cls: ClassAPISymbol,
      protected readonly setterType: Type,
   ) {
      super(context, name);
      this.invocable(`${cls.name}::${name} setter`);
   }

   protected override compile(): SetterCompiled {
      return createPropertyHandler(this.cls, this.name, this.setterType, true);
   }
}
