import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../diagnostics';
import { KernelIterator } from '@bedrock-apis/kernel-isolation';
import { Type } from '../type';

export class VariantType extends Type {
   public constructor(public readonly variants: Type[]) {
      super();
   }

   public validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      const variants = new DiagnosticsStackReport();
      for (const variant of KernelIterator.FromArrayIterator(this.variants.values())) {
         const s = new DiagnosticsStackReport();
         variant.validate(s, value);
         if (s.isEmpty) return diagnostics;
         variants.follow(s);
      }
      return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('variant type'), variants);
   }
}
