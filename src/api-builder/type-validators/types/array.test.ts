import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { ArrayType } from './array';
import { StringType } from './string';
import { ValidateThrow } from './helper.test';

suite('ArrayType', () => {
   test('Array', () => {
      const type = new ArrayType(new StringType());

      expect(() => ValidateThrow(type, ['string', 'string'])).not.toThrow();
      expect(() => ValidateThrow(type, [])).not.toThrow();

      expect(() => ValidateThrow(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, [undefined])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, [null])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, [, , , ,])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, [1, 2])).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
