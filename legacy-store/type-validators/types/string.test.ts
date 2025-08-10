import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { StringType } from './string';

suite('StringType', () => {
   test('String', () => {
      const type = new StringType();

      expect(() => testType(type, '')).not.toThrow();
      expect(() => testType(type, 'not empty string')).not.toThrow();

      expect(() => testType(type, 2)).toThrowErrorMatchingInlineSnapshot(`[TypeError: Native type conversion failed.]`);
   });
});
