import { KernelArray } from 'src/virtual-apis/isolation';
import { ClassDefinition } from '../class-definition';
import { ExecutionContext } from './general';

export class ConstructionExecutionContext extends ExecutionContext {
   public readonly definition: ClassDefinition;
   public readonly constructable: (...params: unknown[]) => unknown;
   public constructor(
      constructable: (...params: unknown[]) => unknown,
      definition: ClassDefinition,
      params: KernelArray<unknown>,
   ) {
      super(definition.context, definition.constructorId, params);
      this.definition = definition;
      this.constructable = constructable;
   }
}
