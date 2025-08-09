import { DiagnosticsStackReport, ErrorFactory, TYPE_ERROR_TYPE } from '../../diagnostics';
import { Type } from '../type';

export class VoidType extends Type {
   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (value !== undefined) {
         diagnostics.report(
            new ErrorFactory('Undefined value expected, but received: ' + typeof value, TYPE_ERROR_TYPE),
         );
         return false;
      }
      return true;
   }
}
