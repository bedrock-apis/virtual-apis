import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Type } from '../type';

export class StringType extends Type {
   public override validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (typeof value !== 'string') diagnostics.report(ERRORS.NativeTypeConversationFailed);
   }
}
