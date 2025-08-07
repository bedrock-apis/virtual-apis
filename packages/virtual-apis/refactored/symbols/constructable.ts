import { Kernel } from '@bedrock-apis/kernel-isolation';
import { ConstructionExecutionContext } from '../../src/context/execution-context';
import { createConstructableFunction, finalizeAsConstructable } from '../ecma-factories';
import { InvocableSymbol } from './invocable';

import { API_ERRORS_MESSAGES, QUICK_JS_ENV_ERROR_MESSAGES } from '../../src/diagnostics';
import { ParamsDefinition } from '../../src/type-validators';

export class ConstructableSymbol extends InvocableSymbol<new (...params: unknown[]) => unknown> {
   public readonly paramsDefinition: ParamsDefinition = new ParamsDefinition();
   public readonly parent: ConstructableSymbol | null = null;
   public readonly requireNew: boolean = true;
   public readonly isConstructable: boolean = false;
   public setRequireNew(isExpected: boolean) {
      (this as Mutable<this>).requireNew = isExpected;
      return this;
   }
   public setIsConstructable(isConstructable: boolean) {
      (this as Mutable<this>).isConstructable = isConstructable;
      return this;
   }
   public setParent(parent: ConstructableSymbol): this {
      (this as Mutable<this>).parent = parent;
      return this;
   }
   public createInstance(_: ConstructionExecutionContext): unknown {
      return Object.create(null);
   }
   public override compile(): new (...params: unknown[]) => unknown {
      const ctor = createConstructableFunction((_, newTarget, params): unknown => {
         const executionContext = new ConstructionExecutionContext(
            ctor as any,
            this as any,
            params,
            (newTarget ?? null) as any,
         );
         // Logic we had in factories before
         const { diagnostics } = executionContext;
         // Constructor should be callable only with "NEW" keyword
         if (!newTarget && this.requireNew) diagnostics.errors.report(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());

         // If constructor is present for this class
         if (!this.isConstructable) diagnostics.errors.report(API_ERRORS_MESSAGES.NoConstructor(this.identifier));

         // Validate Errors
         this.paramsDefinition.validate(diagnostics.errors, executionContext.parameters);

         // Checks
         if (!diagnostics.success) {
            executionContext.dispose();
            throw diagnostics.throw(1 + 1);
         }

         // Call Native constructor and sets its result as new.target.prototype
         const constructedValue = this.createInstance(executionContext);
         if (!executionContext.isSuccessful) {
            throw executionContext.throw(1 + 1);
         }

         executionContext.dispose();
         // Checks 2
         if (!diagnostics.success) {
            // TODO: What design of our plugin system we want right?
            // definition.__reports(executionContext);
            throw diagnostics.throw(1 + 1);
         }
         return Kernel.__setPrototypeOf(constructedValue, (newTarget as Function)?.prototype ?? ctor.prototype);
      });

      // We don't want to compile its value
      finalizeAsConstructable(ctor, this.name, this.paramsLength, this.parent?.getRuntimeValue() ?? null);
      return ctor;
   }
}
