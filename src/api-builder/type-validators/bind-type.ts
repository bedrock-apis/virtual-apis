import { ClassDefinition } from '../class-definition';
import { Errors, Diagnostics } from '../errors';
import { Kernel } from '../kernel';
import { BaseType } from './base-types';

export class ClassBindType extends BaseType {
  public constructor(public readonly definition: ClassDefinition) {
    super();
  }
  public validate(diagnostics: Diagnostics, object: unknown): void {
    if (!this.definition.isThisType(object)) diagnostics.report(Errors.NoImplementation());
  }
}
export class InterfaceBindType extends BaseType {
  public readonly properties = Kernel.Construct('Map') as Map<string, BaseType>;
  public constructor(name: string) {
    super();
  }
  public validate(diagnostics: Diagnostics, object: unknown): void {
    // TODO: No implementation error
    diagnostics.report(Errors.NoImplementation());
  }
  public addProperty(name: string, type: BaseType) {
    this.properties.set(name, type);
    return this;
  }
}
