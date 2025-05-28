import { Kernel } from '@bedrock-apis/kernel-isolation';
import { Type } from '../../type-validators';
import { ContextOptions } from '../context-config';
import { ExecutionContext } from '../execution-context';

export type FunctionNativeHandler = (that: unknown, params: ArrayLike<unknown>) => unknown;

export function proxyify(method: FunctionNativeHandler): (...p: unknown[]) => unknown {
   // Handle with proxy for support with "this" callback
   const final = new Kernel['globalThis::Proxy'](method, {
      apply(t, that, params) {
         return t(that, params);
      },
   });

   // Return
   return final as (...p: unknown[]) => unknown;
}
export function finalize<T extends FunctionNativeHandler>(method: T, length = 0): T {
   // Mark function as native
   Kernel.SetFakeNative(method);

   // Set virtual number of params
   Kernel.SetLength(method, length);

   // All these names of methods are empty
   Kernel.SetName(method, '');

   return method;
}
export function validateReturnType(executionContext: ExecutionContext, returnType: Type) {
   const validate = executionContext.context.getConfigProperty(ContextOptions.StrictReturnTypes);
   returnType.validate(
      validate ? executionContext.diagnostics.errors : executionContext.diagnostics.warns,
      executionContext.result,
   );
}
