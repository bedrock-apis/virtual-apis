import { Range } from '../../../script-module-metadata';
import { Diagnostics, ERRORS } from '../../errors';
import { Kernel } from '../../kernel';
import { Type } from '../type';

const isFinite = Kernel['globalThis::isFinite'];
const isNaN = Kernel['globalThis::isNaN'];

export abstract class BaseNumberType<T extends number | bigint> extends Type {
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

      BaseNumberType.ValidateRange<T>(diagnostics, value as T, this.range);
   }

   public static ValidateRange<T extends number | bigint>(
      diagnostics: Diagnostics,
      value: T,
      range: Range<T, T>,
      argument?: number,
   ) {
      if ((typeof value === 'number' || typeof value === 'bigint') && (value < range.min || value > range.max)) {
         if (typeof argument === 'number') {
            diagnostics.report(ERRORS.FunctionArgumentBounds(value, range, argument));
         } else diagnostics.report(ERRORS.OutOfRange(value, range));
      }
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
