import { ClassAPISymbol } from '../../context/symbols/class';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../diagnostics';
import { Type } from '../type';

export class ClassBindType extends Type {
   public constructor(public readonly definition: ClassAPISymbol) {
      super();
   }
   public validate(diagnostics: DiagnosticsStackReport, object: unknown) {
      // TODO: What Error it should report?
      if (!this.definition.isThisType(object)) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return diagnostics;
   }
}
