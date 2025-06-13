import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { ArrayType } from './array';
import { StringType } from './string';

suite('ArrayType', () => {
   test('Array', () => {
      const type = new ArrayType(new StringType());

      expect(() => testType(type, ['string', 'string'])).not.toThrow();
      expect(() => testType(type, [])).not.toThrow();

      expect(() => testType(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, [undefined])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Array contains unsupported type.]`,
      );
      expect(() => testType(type, [null])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Array contains unsupported type.]`,
      );
      expect(() => testType(type, [, , , ,])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Array contains unsupported type.]`,
      );
      expect(() => testType(type, [1, 2])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Array contains unsupported type.]`,
      );
   });
});
