import { isPromise } from 'node:util/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType, Type } from '../type';

export class PromiseType extends Type {
   // Used to convert values that are returned
   public constructor(public readonly valueType: RuntimeType) {
      super();
   }
   public name = 'promise';
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (!isPromise(value)) return (diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false);
      return true;
   }
}
