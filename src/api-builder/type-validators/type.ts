import { Diagnostics, DiagnosticsStack, Report } from '../diagnostics';
import { Kernel } from '../kernel';

export abstract class Type extends Kernel.Empty {
   // Diagnostics are always passed by someone who requested this type check
   public abstract validate(diagnostics: DiagnosticsStack, value: unknown): void;
}

export class VoidType extends Type {
   public override validate(diagnostics: DiagnosticsStack, value: unknown) {
      if (value !== undefined)
         diagnostics.report(new Report('Type Report: ' + typeof value, Kernel['TypeError::constructor']));
   }
}
