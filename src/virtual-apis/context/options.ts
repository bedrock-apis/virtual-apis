import { Kernel } from '../isolation';

export class ContextOptions extends Kernel.Empty {
   public strictReturnTypes: boolean = true;
   public getterRequireValidBound: boolean = false;
}
