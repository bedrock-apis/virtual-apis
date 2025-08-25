import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';

export const booleanType = {
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (typeof value !== 'boolean')
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
