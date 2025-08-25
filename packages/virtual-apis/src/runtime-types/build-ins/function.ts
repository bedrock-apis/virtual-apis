import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType } from '../type';

export const functionType: RuntimeType = {
   name: 'function',
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      // TODO: No error message
      if (typeof value !== 'function')
         // TODO: Is it really native type conversion error?
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
