import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { Diagnostics, Report } from '../diagnostics';
import { ModuleContext } from './module-context';
import { ClassAPICompiled, ClassAPISymbol } from './symbols/class';

/**
 * ## Execution Context
 *
 * The execution context is a crucial component within Virtual APIs, serving as a dedicated environment for each API
 * invocation. It encapsulates all the necessary data and resources required for the API call's lifecycle, ensuring
 * isolation and proper management of operations.
 *
 * ### Key Responsibilities:
 *
 * - **Data Storage:** Holds input parameters, intermediate values, and the final output of the API call.
 * - **Resource Management:** Provides access to relevant resources, such as the API definition, associated instances, and
 *   supporting utilities.
 * - **Error Handling:** Facilitates error tracking and reporting during the API execution.
 * - **Isolation:** Ensures that each API call operates in its own isolated context, preventing interference between
 *   concurrent invocations.
 *
 * ### Importance:
 *
 * The execution context enables Virtual APIs to maintain state, manage dependencies, and handle errors effectively. By
 * providing a well-defined and isolated environment for each API call, it contributes to the overall stability,
 * reliability, and maintainability of the system.
 */
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

export class ConstructionExecutionContext extends ExecutionContext {
   public constructor(
      public readonly constructable: ClassAPICompiled,
      public readonly definition: ClassAPISymbol,
      params: KernelArray<unknown>,
      public readonly newTarget: null | ((...params: unknown[]) => unknown),
   ) {
       
      super(definition.context, definition.invocableId!, params);
   }
}
export class InstanceExecutionContext extends ExecutionContext {
   public constructor(
      public readonly definition: ClassAPISymbol,
      public readonly method: (this: object, ...p: unknown[]) => unknown,
      methodId: string,
      public readonly handle: unknown,
      params: KernelArray<unknown>,
   ) {
      super(definition.context, methodId, params);
   }
}
