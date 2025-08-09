import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../diagnostics';
import { RuntimeType, Type } from './type';

export class ParamsValidator extends Type {
   public constructor(
      public readonly types: RuntimeType[],
      public readonly minimumArgumentsRequired: number = types.length,
   ) {
      super();
   }
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
      for (let i = 0; i < this.types.length; i++)
         if (!this.types[i]!.isValidValue(diagnostics, params[i])) isValid = false;

      return isValid;
   }
}
