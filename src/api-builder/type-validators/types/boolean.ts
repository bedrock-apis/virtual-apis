import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Type } from '../type';

export class BooleanType extends Type {
   public override validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (typeof value !== 'boolean') diagnostics.report(ERRORS.NativeTypeConversationFailed);
   }
}
