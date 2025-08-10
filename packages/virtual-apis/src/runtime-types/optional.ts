import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { Type } from './type';

export class OptionalType extends Type {
   public constructor(public readonly type: Type) {
      super();
   }

   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (value === undefined || value === null) return true;
      const optionals = new DiagnosticsStackReport();
      const $ = this.type.isValidValue(optionals, value);
      if (!$) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('optional type'), optionals), false;
      return $;
   }
}
