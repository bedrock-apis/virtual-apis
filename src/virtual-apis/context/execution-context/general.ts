import { Kernel } from '../../isolation/kernel';
import { Diagnostics, Report } from '../../diagnostics';
import { Context } from '../context';
import { KernelArray } from 'src/virtual-apis/isolation';
import type { API, APIInfo } from '../managers/factory.info';

export class ExecutionContext extends Kernel.Empty {
   public readonly context: Context;
   public readonly diagnostics: Diagnostics = new Diagnostics();
   public readonly api: APIInfo;
   public readonly parameters: KernelArray<unknown>;
   public result: unknown;
   public get isSuccessful() {
      return this.diagnostics.success;
   }
   public constructor(context: Context, api: APIInfo, parameters: KernelArray<unknown>) {
      super();
      this.context = context;
      this.api = api;
      this.parameters = parameters;
   }
   public dispose(): 0 | -1 {
      if (!this.diagnostics.isEmpty) this.context.runtime.reportExecution(this);
      return 0;
   }
   public report(error: Report) {
      this.diagnostics.errors.report(error);
   }
   public throw(errorStack: number = 0) {
      return this.diagnostics.throw(errorStack + 1);
   }
}
