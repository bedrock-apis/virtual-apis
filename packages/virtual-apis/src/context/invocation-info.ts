import { Diagnostics, type Report } from '../errorable';
import { type InvocableSymbol } from '../symbols/invocable';
import { type Context } from './base';
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
export class InvocationInfo {
   public readonly diagnostics: Diagnostics = new Diagnostics();
   public result: unknown;
   public readonly thisObject: unknown | null = null;
   public readonly newTargetObject: unknown | null = null;
   public constructor(
      public readonly context: Context,
      public readonly symbol: InvocableSymbol<unknown>,
      public readonly params: unknown[],
   ) {}

   public get isSuccessful() {
      return this.diagnostics.success;
   }

   public report(error: Report) {
      this.diagnostics.errors.report(error);
   }
   public throw(errorStack: number = 0) {
      return this.diagnostics.throw(errorStack + 1);
   }
   public setThisObject(object: unknown): this {
      (this as Mutable<this>).thisObject = object;
      return this;
   }
   public setParams(params: unknown[]): this {
      (this as Mutable<this>).params = params;
      return this;
   }
   public setNewTargetObject(newTarget: unknown): this {
      (this as Mutable<this>).newTargetObject = newTarget;
      return this;
   }
}
