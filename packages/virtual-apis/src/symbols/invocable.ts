import { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { CompileTimeError } from '../errorable';
import { RuntimeType } from '../runtime-types';
import type { ParamsValidator } from '../runtime-types/params-validator';
import { CompilableSymbol } from './general';

export abstract class InvocableSymbol<T> extends CompilableSymbol<T> {
   public readonly returnType!: RuntimeType;
   public readonly params!: ParamsValidator;
   public readonly identifier!: string;
   public readonly paramsLength!: number;
   protected runtimeGetResult(info: InvocationInfo): unknown {
      const diagnostics = info.diagnostics;

      // Checks Before
      // This check is here to throw back if this invocable wasn't invoked properly from api side
      if (!diagnostics.success) {
         // Context.report unexpected / type mismatch and others, not plugins fault
         //info.dispose();
         throw diagnostics.throw(1 + 1);
      }

      // Call Native constructor and sets its result as new.target.prototype
      this.invoke(info);
      if (!info.isSuccessful) {
         throw info.throw(1 + 1);
      }

      // We want to warn that plugin probably returned mismatched type
      this.returnType.isValidValue(diagnostics.warns, info.result);

      // Checks 2
      if (!diagnostics.success) {
         // TODO: What design of our plugin system we want right?
         // definition.__reports(executionContext);
         throw diagnostics.throw(1 + 1);
      }
      return info.result;
   }
   protected invoke(info: InvocationInfo) {
      throw new ReferenceError('Implementation missing depends on context implementation');
   }
   //#region  SetMethods
   public setReturnType(type: RuntimeType): this {
      (this as Mutable<this>).returnType = type;
      return this;
   }
   public setParams(validator: ParamsValidator): this {
      (this as Mutable<this>).params = validator;
      return this;
   }
   public setParamsLength(length: number): this {
      (this as Mutable<this>).paramsLength = length;
      return this;
   }
   public setIdentifier(identifier: string): this {
      (this as Mutable<this>).identifier = identifier;
      return this;
   }
   public override setName(name: string): this {
      const $ = super.setName(name);
      this.setIdentifier(name);
      return $;
   }
   public override precompileChecks(_: Context): void {
      super.precompileChecks(_);
      if (!this.returnType) throw new CompileTimeError('ReturnType is not set, but required for compilation');
      if (!this.params) throw new CompileTimeError('Params are not set, but required for compilation');
   }
   //#endregion
}
