import { isPromise } from 'node:util/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType } from '../type';

export const promiseType: RuntimeType = {
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (!isPromise(value)) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
