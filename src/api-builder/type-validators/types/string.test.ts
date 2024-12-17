import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { StringType } from './string';
import { ValidateThrow } from './helper.test';

suite('StringType', () => {
   test('String', () => {
      const type = new StringType();

      expect(() => ValidateThrow(type, '')).not.toThrow();
      expect(() => ValidateThrow(type, 'not empty string')).not.toThrow();

      expect(() => ValidateThrow(type, 2)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
