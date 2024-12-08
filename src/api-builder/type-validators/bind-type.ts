import { ClassDefinition } from '../class-definition';
import { Diagnostics, Errors } from '../errors';
import { Kernel } from '../kernel';
import { Type } from './type';

export class ClassBindType extends Type {
  public constructor(public readonly definition: ClassDefinition) {
    super();
  }
  public validate(diagnostics: Diagnostics, object: unknown): void {
    if (!this.definition.isThisType(object)) diagnostics.report(Errors.NoImplementation);
  }
}
export class InterfaceBindType extends Type {
  public readonly properties = Kernel.Construct('Map') as Map<string, Type>;
  public constructor(name: string) {
    super();
  }
  public validate(diagnostics: Diagnostics, object: unknown): void {
    if (typeof object === 'function' || typeof object === 'object') Kernel['globalThis::Number'](5);
    else diagnostics.report(Errors.NativeTypeConversationFailed);

    // TODO: No implementation error
    diagnostics.report(Errors.NoImplementation);
  }
  public addProperty(name: string, type: Type) {
    this.properties.set(name, type);
    return this;
  }
}
