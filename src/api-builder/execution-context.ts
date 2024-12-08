import { ClassDefinition } from './class-definition';

export class ExecutionConcept {
   public result: unknown;
   public constructor(
      public readonly definition: ClassDefinition,
      public readonly methodId: string,
      public readonly handle: object,
      public readonly parameters: ArrayLike<unknown>,
   ) {}
   public setResult(result: unknown) {
      this.result = result;
   }
}
