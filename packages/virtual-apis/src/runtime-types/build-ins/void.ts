import { ErrorFactory, TYPE_ERROR_TYPE } from '../../errorable';
import { RuntimeType } from '../type';

export const voidType: RuntimeType = {
   isValidValue(diagnostics, value) {
      if (value !== undefined) {
         diagnostics.report(
            new ErrorFactory('Undefined value expected, but received: ' + typeof value, TYPE_ERROR_TYPE),
         );
         return false;
      }
      return true;
   },
};
