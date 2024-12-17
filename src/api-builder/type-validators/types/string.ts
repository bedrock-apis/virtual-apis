import { DiagnosticsStackReport, NativeConversionFailedErrorFactory } from '../../diagnostics';
import { Type } from '../type';

export class StringType extends Type {
   public override validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (typeof value !== 'string') diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}
