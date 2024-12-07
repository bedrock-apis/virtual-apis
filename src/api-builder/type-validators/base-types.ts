import type { MetadataType } from '../../package-builder/ScriptModule';
import { Report, Reports } from '../errors';
import { Kernel } from '../kernel';

const IsFinite = Kernel['globalThis::isFinite'];
const Number = Kernel['globalThis::Number'];

export abstract class BaseType {
  public static readonly BIND_TYPE_TYPES = Kernel.Construct('Map') as Map<string, BaseType>;
  public static register(name: string, type: BaseType) {
    this.BIND_TYPE_TYPES.set(name, type);
  }
  public static resolve(metadataType: MetadataType) {
    // TODO: Metadata type
    throw new Kernel['ReferenceError::constructor']('No implementation error');
  }
  public abstract validate(object: unknown): Reports;
}

export class NumberType extends BaseType {
  public constructor(public readonly range: { min: number; max: number }) {
    super();
  }
  public validate(object: unknown) {
    if (!IsFinite(Number(object)))
      return new Reports([
        new Report('WTF, we have to test how minecraft reacts on Infinity or NaN', Kernel['Error::constructor']),
      ]);

    return new Reports();
  }
}

export class VoidType extends BaseType {
  public constructor() {
    super();
  }
  public validate(object: unknown) {
    if (object === undefined) return new Reports();
    return new Reports([new Report('Invalid Void Error', Kernel.Constructor('TypeError'))]);
  }
}
