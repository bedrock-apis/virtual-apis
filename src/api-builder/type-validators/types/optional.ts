import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Type } from '../type';

export class OptionalType extends Type {
   public constructor(private type: Type) {
      super();
   }

   public validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (typeof value === 'undefined' || value === null) return;

      const optionalDiagnostic = new DiagnosticsStack();
      this.type.validate(optionalDiagnostic, value);
      if (!optionalDiagnostic.isEmpty)
         diagnostics.report(
            // TODO: Reimplement errors in general
            ...optionalDiagnostic.stack.map(e =>
               ERRORS.NativeTypeConversationFailed === e ? ERRORS.NativeOptionalTypeConversationFailed : e,
            ),
         );
   }
}
