import { isPromise } from 'node:util/types';
import { DiagnosticsStackReport, NativeConversionFailedErrorFactory } from '../../diagnostics';
import { Type } from '../type';

export class PromiseType extends Type {
   public validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (!isPromise(value)) diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}
