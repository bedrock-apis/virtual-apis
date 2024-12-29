import { Kernel } from '../../kernel';
import { Diagnostics, BaseReport } from '../../diagnostics';
import { Context } from '../context';
import { Mutable } from '../../../helper-types';

export class ExecutionContext extends Kernel.Empty {
   public readonly context: Context;
   public readonly error: BaseReport | null = null;
   public readonly diagnostics: Diagnostics = new Diagnostics();
   public readonly methodId: string;
   public readonly parameters: unknown[];
   public constructor(context: Context, methodId: string, parameters: unknown[]) {
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
   public throw(error: BaseReport) {
      (this as Mutable<this>).error = error;
   }
}
