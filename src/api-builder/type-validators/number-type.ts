import { Diagnostics, Errors } from '../errors';
import { Kernel } from '../kernel';
import { BaseType } from './base-types';

const IsFinite = Kernel['globalThis::isFinite'];
const Number = Kernel['globalThis::Number'];

export class NumberType extends BaseType {
  public constructor(public readonly range: { min: number; max: number }) {
    super();
  }
  public override validate(diagnostics: Diagnostics, value: unknown) {
    if (typeof value !== 'number') return diagnostics.report(Errors.NativeTypeConversationFailed());

    if (!IsFinite(Number(value)))
      return diagnostics.report(Errors.ValueIsNotSupported(Kernel['globalThis::isNaN'](value) ? 'NaN' : 'Infinity'));

    if (value < this.range.min || value > this.range.max)
      return diagnostics.report(
        `Provided integer value was out of range.  Value: ${value}, argument bounds: [${this.range.min}, ${this.range.max}]`,
        Kernel['Error::constructor'], // TODO: Resolve ArgumentOutOfBounds error constructor
      );
  }
}
export class BigIntType extends NumberType {
  public override validate(diagnostics: Diagnostics, value: unknown) {
    if (typeof value !== 'bigint') {
      return diagnostics.report(Errors.NativeTypeConversationFailed());
    }

    if (value < this.range.min || value > this.range.max)
      return diagnostics.report(
        `Provided integer value was out of range.  Value: ${value}, argument bounds: [${this.range.min}, ${this.range.max}]`,
        Kernel['Error::constructor'], // TODO: Resolve ArgumentOutOfBounds error constructor
      );

    return diagnostics;
  }
}
