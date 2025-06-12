import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { Diagnostics, Report } from '../../diagnostics';
import { ModuleContext } from '../module-context';

export class ExecutionContext extends Kernel.Empty {
   public readonly diagnostics: Diagnostics = new Diagnostics();

   public result: unknown;

   public constructor(
      public readonly context: ModuleContext,
      public readonly methodId: string,
      public readonly parameters: KernelArray<unknown>,
   ) {
      super();
   }

   public get isSuccessful() {
      return this.diagnostics.success;
   }

   public dispose(): 0 | -1 {
      if (!this.diagnostics.isEmpty) this.context.reportDiagnostics(this.diagnostics);
      return 0;
   }
   public report(error: Report) {
      this.diagnostics.errors.report(error);
   }
   public throw(errorStack: number = 0) {
      return this.diagnostics.throw(errorStack + 1);
   }
}
