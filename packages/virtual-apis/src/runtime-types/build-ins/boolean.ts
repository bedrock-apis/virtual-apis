import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType } from '../type';

export const booleanType: RuntimeType = {
   name: 'boolean',
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (typeof value !== 'boolean')
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
