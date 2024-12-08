import { Diagnostics, ERRORS } from '../errors';
import { Kernel } from '../kernel';
import { Type } from './type';

const isFinite = Kernel['globalThis::isFinite'];
const Number = Kernel['globalThis::Number'];
const isNaN = Kernel['globalThis::isNaN'];

export class NumberType extends Type {
  public constructor(public readonly range: { min: number; max: number }) {
    super();
  }
  public override validate(diagnostics: Diagnostics, value: unknown) {
    if (typeof value !== 'number') return diagnostics.report(ERRORS.NativeTypeConversationFailed);

    if (!isFinite(Number(value)))
      return diagnostics.report(ERRORS.ValueIsNotSupported(isNaN(value) ? 'NaN' : 'Infinity'));

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
      return diagnostics.report(ERRORS.NativeTypeConversationFailed);
    }

    if (value < this.range.min || value > this.range.max)
      return diagnostics.report(
        `Provided integer value was out of range.  Value: ${value}, argument bounds: [${this.range.min}, ${this.range.max}]`,
        Kernel['Error::constructor'], // TODO: Resolve ArgumentOutOfBounds error constructor
      );

    return diagnostics;
  }
}
