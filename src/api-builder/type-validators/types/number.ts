import { Diagnostics, ERRORS } from '../../errors';
import { Kernel } from '../../kernel';
import { Type } from '../type';

const isFinite = Kernel['globalThis::isFinite'];
const isNaN = Kernel['globalThis::isNaN'];

abstract class BaseNumberType<T extends number | bigint> extends Type {
   public abstract readonly type: 'number' | 'bigint';
   public abstract readonly isFiniteCheck: boolean;

   public constructor(public readonly range: { min: T; max: T }) {
      super();
   }

   public override validate(diagnostics: Diagnostics, value: unknown) {
      if (typeof value !== this.type) return diagnostics.report(ERRORS.NativeTypeConversationFailed);

      if (this.isFiniteCheck && !isFinite(value as unknown as number)) {
         return diagnostics.report(ERRORS.ValueIsNotSupported(isNaN(value as unknown as number) ? 'NaN' : 'Infinity'));
      }

      if ((value as number) < this.range.min || (value as number) > this.range.max)
         return diagnostics.report(
            `Provided integer value was out of range.  Value: ${value}, argument bounds: [${this.range.min}, ${this.range.max}]`,
            Kernel['Error::constructor'], // TODO: Resolve ArgumentOutOfBounds error constructor
         );
   }
}

export class NumberType extends BaseNumberType<number> {
   public type = 'number' as const;
   public isFiniteCheck = true;
}

export class BigIntType extends BaseNumberType<bigint> {
   public type = 'bigint' as const;
   public isFiniteCheck = false;
}
