import { Diagnostics, DiagnosticsStackReport, Report, TypeErrorFactory } from '../diagnostics';
import { Kernel } from '../kernel';

export abstract class Type extends Kernel.Empty {
   // Diagnostics are always passed by someone who requested this type check
   public abstract validate(diagnostics: DiagnosticsStackReport, value: unknown): DiagnosticsStackReport;
}

export class VoidType extends Type {
   public override validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (value !== undefined) diagnostics.report(new TypeErrorFactory('Type Report: ' + typeof value));
      return diagnostics;
   }
}
