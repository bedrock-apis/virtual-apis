import { ClassDefinition } from '../class-definition';
import { Errors, Reports } from '../errors';
import { Kernel } from '../kernel';
import { BaseType } from './base-types';

export class ClassBindType extends BaseType {
  public constructor(public readonly definition: ClassDefinition) {
    super();
  }
  public validate(object: unknown): Reports {
    if (!this.definition.isThisType(object)) return new Reports([Errors.NoImplementation()]);

    return new Reports();
  }
}
export class InterfaceBindType extends BaseType {
  public readonly properties = Kernel.Construct('Map') as Map<string, { type: BaseType; isOptional: boolean }>;
  public constructor(name: string) {
    super();
  }
  public validate(object: unknown): Reports {
    return new Reports([Errors.NoImplementation()]);
  }
  public addProperty(name: string, type: BaseType, isOptional: boolean = false) {
    this.properties.set(name, { type, isOptional: Kernel['Boolean::constructor'](isOptional) });
    return this;
  }
}
