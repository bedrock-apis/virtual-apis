import type { MetadataType } from '../../package-builder/ScriptModule';
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
    throw new ReferenceError('No implementation error');
  }
  public abstract validate(object: unknown): Error | null;
}
export class NumberType extends BaseType {
  public constructor(public readonly range: { min: number; max: number }) {
    super();
  }
  public validate(object: unknown) {
    if (!IsFinite(Number(object)))
      return new Kernel['Error::constructor']('WTF, we have to test how minecraft reacts on Infinity or NaN');

    return null;
  }
}
