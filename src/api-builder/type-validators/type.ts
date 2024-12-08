import { Diagnostics, Report } from '../errors';
import { Kernel } from '../kernel';

export abstract class Type {
  public static readonly BIND_TYPE_TYPES = Kernel.Construct('Map') as Map<string, Type>;
  public static registerBindType(name: string, type: Type) {
    this.BIND_TYPE_TYPES.set(name, type);
  }
  // Diagnostics are always passed by someone who requested this type check
  public abstract validate(diagnostics: Diagnostics, value: unknown): void;
}

export class VoidType extends Type {
  public override validate(diagnostics: Diagnostics, value: unknown) {
    if (value !== undefined) diagnostics.report(new Report('Type Report', Kernel['TypeError::constructor']));
  }
}
