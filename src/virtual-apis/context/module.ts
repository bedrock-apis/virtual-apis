import { suite } from 'vitest';
import { Kernel } from '../isolation';
import { Context } from './context';

export class ClassDefinition extends Kernel.Empty {
   public readonly hasConstructor: boolean = false;
   public readonly newKeywordRequired: boolean = true;
   public constructor() {
      super();
   }
}
export class ModuleDefinition extends Kernel.Empty {
   public readonly context: Context;
   public constructor() {
      super();
   }
}
