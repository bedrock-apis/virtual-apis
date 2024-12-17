import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { BooleanType } from './boolean';
import { ValidateThrow } from './helper.test';

suite('BooleanType', () => {
   test('Boolean', () => {
      const type = new BooleanType();

      expect(() => ValidateThrow(type, false)).not.toThrow();
      expect(() => ValidateThrow(type, true)).not.toThrow();

      expect(() => ValidateThrow(type, 2)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
