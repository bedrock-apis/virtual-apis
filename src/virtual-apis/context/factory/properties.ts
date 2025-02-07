import { KernelArray } from 'src/virtual-apis/isolation';
import { API_ERRORS_MESSAGES, ErrorFactory, WARNING_ERROR_MESSAGES } from '../../diagnostics';
import { Kernel } from '../../isolation/kernel';
import { InstanceExecutionContext } from '../execution-context';
import { finalize, FunctionNativeHandler, proxyify } from './base';
import { API, APIMemberInfo } from '../managers/factory.info';

export function createFunctionalSetter(
   api: APIMemberInfo,
   contextFactory: (that: unknown, params: KernelArray<unknown>) => InstanceExecutionContext,
   handler: (exec: InstanceExecutionContext) => void,
   trimStack: number = 0,
): API {
   // Build arrow function so the methods are not possible to call with new expression
   const m = (that: unknown, params: ArrayLike<unknown>) => {
      const executionContext = contextFactory(that, KernelArray.From(params));
      const { diagnostics, context } = executionContext;

      // Check if the object has native bound
      if (!context.runtime.nativeHandles.has(that as object))
         diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('setter', api.id));

      // Validate params
      api.type.validate(diagnostics.errors, params[0]);

      // Validate correctness of this type
      // If that fails it should throw "Failed to set member"
      (api as APIMemberInfo).type.validate(diagnostics.errors, that);

      // Check for diagnostics and report first value
      if (!diagnostics.success) {
         executionContext.dispose();
         throw diagnostics.throw(trimStack + 1);
      }

      handler(executionContext);
      if (!executionContext.isSuccessful) {
         throw executionContext.throw(trimStack + 1);
      }

      // TODO: Implement privileges and type checking
      //if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
      //let error = functionType.ValidArgumentTypes(params);
      //if(error) throw new error.ctor(error.message);

      if (executionContext.result !== undefined)
         diagnostics.warns.report(
            ErrorFactory.New(
               WARNING_ERROR_MESSAGES.SettersShouldReturnUndefined(executionContext.api.id),
               Kernel['TypeError::constructor'],
            ),
         );
      executionContext.dispose();

      // Checks 2
      if (!diagnostics.success) {
         // TODO: What design of our plugin system we want right?
         // definition.__reports(executionContext);
         throw diagnostics.throw(trimStack + 1);
      }
      return undefined;
   };
   const f = proxyify(m);
   finalize(f, 1);
   return f as unknown as API;
}
export function createFunctionalGetter(
   api: APIMemberInfo,
   contextFactory: (that: unknown, params: KernelArray<unknown>) => InstanceExecutionContext,
   handler: (exec: InstanceExecutionContext) => void,
   trimStack: number = 0,
): API {
   const m = (that: unknown, params: ArrayLike<unknown>) => {
      const executionContext = contextFactory(that, KernelArray.From(params));
      const { diagnostics, context } = executionContext;
      // Check if the object has native bound
      if (!context.runtime.nativeHandles.has(that as object)) {
         diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('getter', api.id));
      }

      // Validate correctness of this type
      api.type.validate(diagnostics.errors, that);

      // Check for diagnostics and report first value
      if (!diagnostics.success) {
         executionContext.dispose();
         if (!context.options.getterRequireValidBound) return undefined;
         throw diagnostics.throw(trimStack + 1);
      }

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
      // TODO: Implement privileges and type checking
      //if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
      //let error = functionType.ValidArgumentTypes(params);
      //if(error) throw new error.ctor(error.message);

      return executionContext.result;
   };

   const f = proxyify(m);
   finalize(f, 1);
   return f as unknown as API;
}
