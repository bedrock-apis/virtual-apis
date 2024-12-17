import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { BigIntType, NumberType } from './number';
import { ValidateThrow } from './helper.test';

suite('NumberType', () => {
   test('Number', () => {
      const type = new NumberType({ min: 10, max: 20 });

      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, 9)).toThrowErrorMatchingInlineSnapshot(
         `[Error: Provided integer value was out of range.  Value: 9, argument bounds: [10, 20]]`,
      );
      expect(() => ValidateThrow(type, 10)).not.toThrow();
      expect(() => ValidateThrow(type, 20)).not.toThrow();
      expect(() => ValidateThrow(type, 21)).toThrowErrorMatchingInlineSnapshot(
         `[Error: Provided integer value was out of range.  Value: 21, argument bounds: [10, 20]]`,
      );

      expect(() => ValidateThrow(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Infinity value is not supported.]`,
      );
      expect(() => ValidateThrow(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: NaN value is not supported.]`,
      );
   });

   test('BigInt', () => {
      const type = new BigIntType({ min: 10n, max: 20n });

      expect(() => ValidateThrow(type, 9n)).toThrowErrorMatchingInlineSnapshot(
         `[Error: Provided integer value was out of range.  Value: 9, argument bounds: [10, 20]]`,
      );
      expect(() => ValidateThrow(type, 10n)).not.toThrow();
      expect(() => ValidateThrow(type, 20n)).not.toThrow();
      expect(() => ValidateThrow(type, 21n)).toThrowErrorMatchingInlineSnapshot(
         `[Error: Provided integer value was out of range.  Value: 21, argument bounds: [10, 20]]`,
      );

      expect(() => ValidateThrow(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });

   test('Undefined', () => {
      const type = new NumberType({ min: 10, max: 20 });

      expect(() => ValidateThrow(type, void 0)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
