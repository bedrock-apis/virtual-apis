import { isPromise } from 'node:util/types';
import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Type } from '../type';

export class PromiseType extends Type {
   public validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (!isPromise(value)) diagnostics.report(ERRORS.NativeTypeConversationFailed);
   }
}
