import { Report, Diagnostics } from '../errors';
import { Kernel } from '../kernel';

export abstract class BaseType {
  public static readonly BIND_TYPE_TYPES = Kernel.Construct('Map') as Map<string, BaseType>;
  public static registerBindType(name: string, type: BaseType) {
    this.BIND_TYPE_TYPES.set(name, type);
  }
  // Diagnostics are always passed by someone who requested this type check
  public abstract validate(diagnostics: Diagnostics, value: unknown): void;
}

export class VoidType extends BaseType {
  public override validate(diagnostics: Diagnostics, value: unknown) {
    if (value !== undefined) diagnostics.report(new Report('Type Report', Kernel['TypeError::constructor']));
  }
  public constructor() {
    super();
  }
}
