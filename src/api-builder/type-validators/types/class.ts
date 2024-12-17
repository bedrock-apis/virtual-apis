import { ClassDefinition } from '../../context/class-definition';
import { DiagnosticsStackReport, NativeConversionFailedErrorFactory } from '../../diagnostics';
import { Type } from '../type';

export class ClassBindType extends Type {
   public constructor(public readonly definition: ClassDefinition) {
      super();
   }
   public validate(diagnostics: DiagnosticsStackReport, object: unknown) {
      // TODO: What Error it should report?
      if (!this.definition.isThisType(object)) diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}
