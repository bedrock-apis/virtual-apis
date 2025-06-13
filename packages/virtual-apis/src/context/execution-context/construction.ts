import { KernelArray } from '@bedrock-apis/kernel-isolation';
import { ClassAPICompiled, ClassAPISymbol } from '../symbols/class';
import { ExecutionContext } from './general';

export class ConstructionExecutionContext extends ExecutionContext {
   public constructor(
      public readonly constructable: ClassAPICompiled,
      public readonly definition: ClassAPISymbol,
      params: KernelArray<unknown>,
      public readonly newTarget: null | ((...params: unknown[]) => unknown),
   ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      super(definition.context, definition.invocableId!, params);
   }
}
