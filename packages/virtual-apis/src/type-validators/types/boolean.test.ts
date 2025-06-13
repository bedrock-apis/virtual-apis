import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { BooleanType } from './boolean';

suite('BooleanType', () => {
   test('Boolean', () => {
      const type = new BooleanType();

      expect(() => testType(type, false)).not.toThrow();
      expect(() => testType(type, true)).not.toThrow();

      expect(() => testType(type, 2)).toThrowErrorMatchingInlineSnapshot(`[TypeError: Native type conversion failed.]`);
   });
});
