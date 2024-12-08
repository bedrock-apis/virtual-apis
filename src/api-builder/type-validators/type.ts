import { Diagnostics, Report } from '../errors';
import { Kernel } from '../kernel';

export abstract class Type extends Kernel.Empty {
   public static readonly bindedTypes = Kernel.Construct('Map') as Map<string, Type>;
   public static RegisterBindType(name: string, type: Type) {
      this.bindedTypes.set(name, type);
   }
   // Diagnostics are always passed by someone who requested this type check
   public abstract validate(diagnostics: Diagnostics, value: unknown): void;
}

export class VoidType extends Type {
   public override validate(diagnostics: Diagnostics, value: unknown) {
      if (value !== undefined) diagnostics.report(new Report('Type Report', Kernel['TypeError::constructor']));
   }
}
