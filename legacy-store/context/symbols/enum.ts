import { Kernel } from '@bedrock-apis/kernel-isolation';
import { EnumType } from '../../type-validators/types/enum';
import { ModuleContext } from '../module-context';
import { APISymbol } from './symbol';

export class EnumAPISymbol extends APISymbol {
   public constructor(
      context: ModuleContext,
      name: string,
      protected constants: [key: string, value: unknown][],
   ) {
      super(context, name);
      this.type = new EnumType(constants);
      this.context.registerType(this.name, this.type);
   }

   protected override compile(): object {
      // This is not safe!
      return Kernel['Object::static'].fromEntries(this.constants);
   }
}
