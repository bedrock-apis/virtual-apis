import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType, Type } from '../type';

export class ArrayType extends Type {
   public constructor(public readonly valueType: RuntimeType) {
      super();
   }
   public override name = 'array'; // TODO Check if it includes value type name or not
   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (!Array.isArray(value)) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;

      const elementsDiagnostics = new DiagnosticsStackReport();
      let byAnyChance = true;
      for (let i = 0; i < value.length; i++) {
         byAnyChance &&= this.valueType.isValidValue(elementsDiagnostics, value[i]);
      }
      if (elementsDiagnostics.isThrowable) {
         diagnostics.report(API_ERRORS_MESSAGES.ArrayUnsupportedType(), elementsDiagnostics);
         byAnyChance = false;
      }
      return byAnyChance;
   }
}
