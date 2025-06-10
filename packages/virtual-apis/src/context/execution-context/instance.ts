import { KernelArray } from '@bedrock-apis/kernel-isolation';
import { ClassDefinition } from '../class-definition';
import { ExecutionContext } from '../execution-context';

export class InstanceExecutionContext extends ExecutionContext {
   public readonly definition: ClassDefinition;
   public readonly handle: unknown;
   public readonly method: (this: object, ...p: unknown[]) => unknown;
   public constructor(
      definition: ClassDefinition,
      method: (...p: unknown[]) => unknown,
      methodId: string,
      handle: unknown,
      params: KernelArray<unknown>,
   ) {
      super(definition.context, methodId, params);
      this.definition = definition;
      this.method = method;
      this.handle = handle;
   }
}
