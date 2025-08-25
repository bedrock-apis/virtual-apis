import { Range } from '@bedrock-apis/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType, Type } from '../type';

export class NumberType extends Type {
   public constructor(public readonly range: Range<number, number>) {
      super();
   }

   public override name = 'number';

   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (typeof value !== 'number')
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;

      if (!isFinite(value as unknown as number))
         return diagnostics.report(API_ERRORS_MESSAGES.ValueNotSupported(Number(value).toString())), false;

      if (value < this.range.min || value > this.range.max)
         return diagnostics.report(API_ERRORS_MESSAGES.OutOfRange(value, this.range)), false;

      return true;
   }
   public static readonly default = new this({
      max: Number.MAX_SAFE_INTEGER,
      min: Number.MIN_SAFE_INTEGER,
   });
}

export const bigintType: RuntimeType = {
   name: 'bigint',
   isValidValue(diagnostics, value) {
      if (typeof value !== 'string')
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
