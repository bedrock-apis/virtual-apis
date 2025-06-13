import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { BigIntType, NumberType } from './number';

suite('NumberType', () => {
   test('Number', () => {
      const type = new NumberType({ min: 10, max: 20 });

      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, 9)).toThrowErrorMatchingInlineSnapshot(
         // TODO: Check what mc things, Its really just 'Error' and not 'TypeError'?
         // I changed it to TypeError, but we should test what mc does
         `[TypeError: Provided integer value was out of range.  Value: 9, argument bounds: [10, 20]]`,
      );
      expect(() => testType(type, 10)).not.toThrow();
      expect(() => testType(type, 20)).not.toThrow();
      expect(() => testType(type, 21)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Provided integer value was out of range.  Value: 21, argument bounds: [10, 20]]`,
      );

      expect(() => testType(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Infinity value is not supported.]`,
      );
      expect(() => testType(type, NaN)).toThrowErrorMatchingInlineSnapshot(`[TypeError: NaN value is not supported.]`);
   });

   test('BigInt', () => {
      const type = new BigIntType({ min: 10n, max: 20n });
      expect(() => testType(type, 9n)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Provided integer value was out of range.  Value: 9, argument bounds: [10, 20]]`,
      );
      expect(() => testType(type, 10n)).not.toThrow();
      expect(() => testType(type, 20n)).not.toThrow();
      expect(() => testType(type, 21n)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Provided integer value was out of range.  Value: 21, argument bounds: [10, 20]]`,
      );

      expect(() => testType(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });

   test('Undefined', () => {
      const type = new NumberType({ min: 10, max: 20 });

      expect(() => testType(type, void 0)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
