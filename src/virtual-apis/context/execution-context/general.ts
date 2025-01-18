import { Kernel } from '../../isolation/kernel';
import { Diagnostics, Report } from '../../diagnostics';
import { Context } from '../context';
import { KernelArray } from 'src/virtual-apis/isolation';

export class ExecutionContext extends Kernel.Empty {
   public readonly context: Context;
   public readonly diagnostics: Diagnostics = new Diagnostics();
   public readonly methodId: string;
   public readonly parameters: KernelArray<unknown>;
   public get isSuccessful() {
      return this.diagnostics.success;
   }
   public result: unknown;
   public constructor(context: Context, methodId: string, parameters: KernelArray<unknown>) {
      super();
      this.context = context;
      this.methodId = methodId;
      this.parameters = parameters;
   }
   public dispose(): 0 | -1 {
      if (!this.diagnostics.isEmpty) {
         this.context.reportDiagnostics(this.diagnostics);
      }
      return 0;
   }
   public report(error: Report) {
      this.diagnostics.errors.report(error);
   }
   public throw(errorStack: number = 0) {
      return this.diagnostics.throw(errorStack + 1);
   }
}
