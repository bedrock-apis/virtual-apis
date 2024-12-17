import { ClassDefinition } from './class-definition';
import { Diagnostics } from '../diagnostics';
import { Kernel } from '../kernel';
import { Mutable } from '../../helper-types';
import type { Context } from './context';

export class ConstructionExecutionContext extends Kernel.Empty {
   public readonly context: Context;
   public constructor(
      public readonly self: (new (args: unknown) => unknown) | ((args: unknown) => unknown) | null,
      public readonly definition: ClassDefinition,
      public readonly methodId: string,
      public readonly parameters: unknown[],
      public readonly diagnostics: Diagnostics,
   ) {
      super();
      this.context = definition.context;
   }
   public dispose(): 0 | -1 {
      if (!this.diagnostics.isEmpty) {
         this.definition.context.reportDiagnostics(this.diagnostics);
      }
      return 0;
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
