import { Kernel } from '../../isolation/kernel';
import { ExecutionContext } from '../execution-context';
import { API_ERRORS_MESSAGES, QUICK_JS_ENV_ERROR_MESSAGES } from '../../diagnostics';
import { KernelArray } from 'src/virtual-apis/isolation';
import type { API, APIClassInfo } from '../managers/factory.info';

export function createFunctionalConstructor(
   apiInfo: APIClassInfo,
   contextFactory: (params: KernelArray<unknown>) => ExecutionContext,
   handler: (context: ExecutionContext) => void,
   trimStack: number = 0,
): API {
   // Create function as constructor
   function ctor(...params: unknown[]) {
      const executionContext = contextFactory(KernelArray.From(params));
      const { diagnostics } = executionContext;
      // Constructor should be callable only with "NEW" keyword
      if (!new.target && apiInfo.newExpected) diagnostics.errors.report(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());

      // If constructor is present for this class
      if (apiInfo.params === null) {
         diagnostics.errors.report(API_ERRORS_MESSAGES.NoConstructor(apiInfo.name));
         throw diagnostics.throw(trimStack + 1);
      }

      // Validate Errors
      apiInfo.params.validate(diagnostics.errors, executionContext.parameters);

      // Checks
      if (!diagnostics.success) {
         executionContext.dispose();
         throw diagnostics.throw(trimStack + 1);
      }

      // Call Native constructor and sets its result as new.target.prototype
      handler(executionContext);
      if (!executionContext.isSuccessful) {
         throw executionContext.throw(trimStack + 1);
      }

      executionContext.dispose();
      // Checks 2
      if (!diagnostics.success) {
         // TODO: What design of our plugin system we want right?
         // definition.__reports(executionContext);
         throw diagnostics.throw(trimStack + 1);
      }

      return Kernel.__setPrototypeOf(executionContext.result, new.target?.prototype ?? prototype);
   }
   // Create new prototype with this constructor function
   const prototype = (ctor.prototype = { constructor: ctor });

   // Final sealing so the class has readonly prototype
   Kernel.SetClass(ctor, apiInfo.name);
   return ctor;
}
