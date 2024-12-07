import { ClassDefinition } from '../class-definition';
import { Kernel } from '../kernel';
import { BaseType } from './base-types';

export class ClassBindType extends BaseType {
  public constructor(public readonly definition: ClassDefinition) {
    super();
  }
  public validate(object: unknown): Error | null {
    if (!this.definition.isThisType(object))
      return new Kernel['ReferenceError::constructor']('No implementation error');
    return null;
  }
}
export class InterfaceBindType extends BaseType {
  public readonly properties = Kernel.Construct('Map') as Map<string, { type: BaseType; isOptional: boolean }>;
  public constructor(name: string) {
    super();
  }
  public validate(object: unknown): Error | null {
    return new Kernel['ReferenceError::constructor']('No implementation error');
  }
  public addProperty(name: string, type: BaseType, isOptional: boolean = false) {
    this.properties.set(name, { type, isOptional: Kernel['Boolean::constructor'](isOptional) });
    return this;
  }
}
