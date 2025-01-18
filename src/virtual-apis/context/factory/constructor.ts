import { Kernel } from '../../isolation/kernel';
import { ParamsDefinition } from '../../type-validators';
import { ConstructionExecutionContext } from '../execution-context';
import { API_ERRORS_MESSAGES, QUICK_JS_ENV_ERROR_MESSAGES } from '../../diagnostics';
import { ClassDefinition } from '../class-definition';
import { KernelArray } from 'src/virtual-apis/isolation';

export function createFunctionalConstructor(
   paramsDefinition: ParamsDefinition,
   contextFactory: (params: KernelArray<unknown>) => ConstructionExecutionContext,
   trimStack: number = 0,
): new () => unknown {
   // Create function as constructor
   return function ctor(...params: unknown[]) {
      const executionContext = contextFactory(KernelArray.From(params));
      const { definition, diagnostics } = executionContext;
      // Constructor should be callable only with "NEW" keyword
      if (!new.target && definition.newExpected) diagnostics.errors.report(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());

      // If constructor is present for this class
      if (!definition.hasConstructor) diagnostics.errors.report(API_ERRORS_MESSAGES.NoConstructor(definition.classId));

      // Validate Errors
      paramsDefinition.validate(diagnostics.errors, executionContext.parameters);

      // Checks
      if (!diagnostics.success) {
         executionContext.dispose();
         throw diagnostics.throw(trimStack + 1);
      }

      // Call Native constructor and sets its result as new.target.prototype
      const constructedValue = definition.__construct(executionContext)[0];
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
      return Kernel.__setPrototypeOf(constructedValue, new.target?.prototype ?? definition.api.prototype);
   } as unknown as new () => unknown;
}

export function createConstructorFor<T extends ClassDefinition<ClassDefinition | null, unknown>>(
   definition: T,
   paramsDefinition: ParamsDefinition,
): T['api'] {
   // Create function as constructor
   const ctor = createFunctionalConstructor(
      paramsDefinition,
      params =>
         new ConstructionExecutionContext(
            ctor as unknown as (...p: unknown[]) => unknown,
            definition as ClassDefinition,
            params,
         ),
      0,
   );

   // Create new prototype with this constructor function
   ctor.prototype = { constructor: ctor };

   // Check for inheritance
   const parent = definition.parent;
   if (parent) {
      Kernel.__setPrototypeOf(ctor, parent.api);
      Kernel.__setPrototypeOf(ctor.prototype, parent.api.prototype);
   }

   // Final sealing so the class has readonly prototype
   Kernel.SetClass(ctor, definition.classId);

   // return the Fake API Class
   return ctor as T['api'];
}
