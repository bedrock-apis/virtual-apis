import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { RuntimeType, Type } from './type';

export class VariantType extends Type {
   public readonly variants: RuntimeType[] = [];
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      const variants = new DiagnosticsStackReport();
      for (const variant of this.variants.values()) {
         const s = new DiagnosticsStackReport();
         variant.isValidValue(s, value);
         if (s.isEmpty) return true;
         variants.follow(s);
      }
      return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('variant type'), variants), false;
   }
}
