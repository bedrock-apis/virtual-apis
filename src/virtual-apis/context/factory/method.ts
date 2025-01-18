import { KernelArray } from 'src/virtual-apis/isolation';
import { API_ERRORS_MESSAGES } from '../../diagnostics';
import { ParamsDefinition, Type } from '../../type-validators';
import { ClassDefinition } from '../class-definition';
import { InstanceExecutionContext } from '../execution-context';
import { finalize, FunctionNativeHandler, proxyify, validateReturnType } from './base';

export function createFunctionalMethod(
   paramsDefinition: ParamsDefinition,
   returnType: Type,
   contextFactory: (that: unknown, params: KernelArray<unknown>) => InstanceExecutionContext,
   trimStack: number = 0,
): FunctionNativeHandler {
   return (that: unknown, params: ArrayLike<unknown>) => {
      const executionContext = contextFactory(that, KernelArray.From(params));
      const { diagnostics, context, definition, methodId } = executionContext;

      // Check if the object has native bound
      if (!context.nativeHandles.has(that as object))
         diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('function', methodId));
      // Validate correctness of this type
      definition.type.validate(diagnostics.errors, that);
      // Validate params
      paramsDefinition.validate(diagnostics.errors, executionContext.parameters);

      // Check for diagnostics and report first value
      if (!diagnostics.success) {
         executionContext.dispose();
         throw diagnostics.throw(trimStack + 1);
      }

      definition.__call(executionContext);
      if (!executionContext.isSuccessful) {
         throw executionContext.throw(trimStack + 1);
      }

      // TODO: Shouldn't throw as execution context.dispose should be always called
      validateReturnType(executionContext, returnType);

      executionContext.dispose();

      // Checks 2
      if (!diagnostics.success) {
         // TODO: What design of our plugin system we want right?
         // definition.__reports(executionContext);
         // +1 proxyify
         throw diagnostics.throw(trimStack + 1);
      }
      // TODO: Implement privileges and type checking
      //if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
      //let error = functionType.ValidArgumentTypes(params);
      //if(error) throw new error.ctor(error.message);

      return executionContext.result;
   };
}
export function createMethodFor<T extends ClassDefinition<ClassDefinition | null, unknown>>(
   definition: T,
   name: string,
   paramsDefinition: ParamsDefinition,
   returnType: Type,
): FunctionNativeHandler {
   const id = `${definition.classId}::${name}`;
   // Build arrow function so the methods are not possible to call with new expression
   const proxyThis = proxyify(
      createFunctionalMethod(
         paramsDefinition,
         returnType,
         (that, params) => new InstanceExecutionContext(definition as ClassDefinition, proxyThis, id, that, params),
         1,
      ),
   );
   // Finalize function properties
   finalize(proxyThis, 0);
   // Return builded method
   return proxyThis;
}
