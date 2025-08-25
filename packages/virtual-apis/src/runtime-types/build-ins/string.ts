import { API_ERRORS_MESSAGES } from '../../errorable';
import { RuntimeType } from '../type';

export const stringType: RuntimeType = {
   name: 'string',
   isValidValue(diagnostics, value) {
      if (typeof value !== 'string')
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
