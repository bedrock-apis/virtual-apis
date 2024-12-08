import { Diagnostics, Report } from '../errors';
import { Kernel } from '../kernel';

export abstract class BaseType {
  public static readonly boundTypes = Kernel.Construct('Map') as Map<string, BaseType>;
  public static RegisterBindType(name: string, type: BaseType) {
    this.boundTypes.set(name, type);
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
