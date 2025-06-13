import { KernelArray } from '@bedrock-apis/kernel-isolation';
import { ExecutionContext } from '../execution-context';
import { ClassAPISymbol } from '../symbols/class';

export class InstanceExecutionContext extends ExecutionContext {
   public constructor(
      public readonly definition: ClassAPISymbol,
      public readonly method: (this: object, ...p: unknown[]) => unknown,
      methodId: string,
      public readonly handle: unknown,
      params: KernelArray<unknown>,
   ) {
      super(definition.context, methodId, params);
   }
}
