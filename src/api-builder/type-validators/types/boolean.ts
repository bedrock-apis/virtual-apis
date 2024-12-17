import { DiagnosticsStackReport, NativeConversionFailedErrorFactory } from '../../diagnostics';
import { Type } from '../type';

export class BooleanType extends Type {
   public override validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (typeof value !== 'boolean') return diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}
