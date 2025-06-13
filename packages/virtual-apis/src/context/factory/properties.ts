import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { API_ERRORS_MESSAGES, ErrorFactory, WARNING_ERROR_MESSAGES } from '../../diagnostics';
import { Type } from '../../type-validators';
import { Context, ContextOptions } from '../context';
import { InstanceExecutionContext } from '../execution-context';
import { ClassAPISymbol } from '../symbols/class';
import { finalize, FunctionNativeHandler, proxyify, validateReturnType } from './base';

function createFunctionalSetter(
   type: Type,
   contextFactory: (that: unknown, params: KernelArray<unknown>) => InstanceExecutionContext,
   trimStack: number = 0,
): FunctionNativeHandler {
   // Build arrow function so the methods are not possible to call with new expression
   return (that: unknown, params: ArrayLike<unknown>) => {
      const executionContext = contextFactory(that, KernelArray.From(params));
      const { diagnostics, context, definition, methodId } = executionContext;

      // Check if the object has native bound
      if (!context.nativeHandles.has(that as object))
         diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('setter', methodId));

      // Validate params
      type.validate(diagnostics.errors, params[0]);

      // Validate correctness of this type
      // If that fails it should throw "Failed to set member"
      definition.type.validate(diagnostics.errors, that);

      // Check for diagnostics and report first value
      if (!diagnostics.success) {
         executionContext.dispose();
         throw diagnostics.throw(trimStack + 1);
      }

      definition.__call(executionContext);
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
               WARNING_ERROR_MESSAGES.SettersShouldReturnUndefined(methodId),
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
}
function createFunctionalGetter(
   type: Type,
   contextFactory: (that: unknown, params: KernelArray<unknown>) => InstanceExecutionContext,
   trimStack: number = 0,
): FunctionNativeHandler {
   return (that: unknown, params: ArrayLike<unknown>) => {
      const executionContext = contextFactory(that, KernelArray.From(params));
      const { diagnostics, definition, methodId } = executionContext;
      // Check if the object has native bound
      if (!definition.context.nativeHandles.has(that as object)) {
         diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('getter', methodId));
      }

      // Validate correctness of this type
      definition.type.validate(diagnostics.errors, that);

      // Check for diagnostics and report first value
      if (!diagnostics.success) {
         executionContext.dispose();
         if (!Context.GetConfigProperty(ContextOptions.GetterRequireValidBound)) return undefined;
         throw diagnostics.throw(trimStack + 1);
      }

      definition.__call(executionContext);

      if (!executionContext.isSuccessful) {
         throw executionContext.throw(trimStack + 1);
      }

      validateReturnType(executionContext, type);

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
}
export function createPropertyHandler(definition: ClassAPISymbol, name: string, type: Type, isSetter: boolean) {
   const id = `${definition.name}::${name} ${isSetter ? 'setter' : 'getter'}`;

   const proxyThis = proxyify(
      (isSetter ? createFunctionalSetter : createFunctionalGetter)(
         type,
         (that, params) => new InstanceExecutionContext(definition, proxyThis, id, that, params),
         1,
      ),
   );

   // for setters virtual number of params is always 1, and getters always 0
   finalize(proxyThis, isSetter ? 1 : 0);
   return proxyThis;
}
