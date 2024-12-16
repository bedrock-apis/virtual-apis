import { ClassDefinition } from './class-definition';
import { Diagnostics } from '../errors';
import { Kernel } from '../kernel';
import { Mutable } from '../../helper-types';

export class ConstructionExecutionContext extends Kernel.Empty {
   public constructor(
      public readonly self: (new (args: unknown) => unknown) | ((args: unknown) => unknown) | null,
      public readonly definition: ClassDefinition,
      public readonly methodId: string,
      public readonly parameters: unknown[],
      public readonly diagnostics: Diagnostics,
   ) {
      super();
   }
}

export class ExecutionContext extends ConstructionExecutionContext {
   public readonly resultHasBeenSet: boolean = false;
   public readonly result: unknown;
   public constructor(
      self: (new (args: unknown) => unknown) | ((args: unknown) => unknown) | null,
      definition: ClassDefinition,
      methodId: string,
      parameters: unknown[],
      diagnostics: Diagnostics,
      public readonly handle: object | null,
   ) {
      super(self, definition, methodId, parameters, diagnostics);
   }
   public setResult(result: unknown) {
      Kernel.log('Result set: ' + result);
      (this as Mutable<this>).result = result;
      (this as Mutable<this>).resultHasBeenSet = true;
   }
}
