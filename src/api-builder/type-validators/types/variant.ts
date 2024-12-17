import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Type } from '../type';

export class VariantType extends Type {
   public constructor(public readonly variants: Type[]) {
      super();
   }

   public validate(diagnostics: DiagnosticsStack, value: unknown): void {
      for (const variant of this.variants) {
         const variantDiagnostic = new DiagnosticsStack();
         variant.validate(variantDiagnostic, value);
         if (variantDiagnostic.isEmpty) return;
      }
      diagnostics.report(ERRORS.NativeVariantTypeConversationFailed);
   }
}
