import { ClassDefinition } from './class-definition';
import { Diagnostics } from './errors';
import { Kernel } from './kernel';

type Mutable<T> = {
   -readonly [P in keyof T]: T[P];
};

export class ExecutionConcept extends Kernel.Empty {
   public readonly resultHasBeenSet: boolean = false;
   public readonly result: unknown;
   public constructor(
      public readonly definition: ClassDefinition,
      public readonly methodId: string,
      public readonly handle: object,
      public readonly parameters: ArrayLike<unknown>,
      public readonly diagnostics: Diagnostics,
   ) {
      super();
   }
   public setResult(result: unknown) {
      (this as Mutable<this>).result = result;
      (this as Mutable<this>).resultHasBeenSet = true;
   }
}
