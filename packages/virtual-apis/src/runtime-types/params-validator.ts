import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { FunctionArgumentType } from '../main';
import { RuntimeType, Type } from './type';

export class ParamsValidator extends Type {
   public constructor(
      public readonly types: RuntimeType[],
      public readonly minimumArgumentsRequired: number = types.length,
   ) {
      super();
      this.name = `params(${this.types.map(e => e.name).join(', ')})`;
   }
   public override name: string;
   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      const params: unknown[] = Array.isArray(value) ? value : [value];

      if (params.length > this.types.length || params.length < this.minimumArgumentsRequired) {
         diagnostics.report(
            API_ERRORS_MESSAGES.IncorrectNumberOfArguments(
               { min: this.minimumArgumentsRequired, max: this.types.length },
               params.length,
            ),
         );
         return false;
      }

      let isValid = true;
      for (let i = 0; i < this.types.length; i++) {
         const type = this.types[i]!;
         if (type instanceof FunctionArgumentType) params[i] ??= type.defaultValue;
         if (!type.isValidValue(diagnostics, params[i])) isValid = false;
      }

      return isValid;
   }
   public setMinimumParamsRequired(value: number): this {
      (this as Mutable<this>).minimumArgumentsRequired = value;
      return this;
   }
}
