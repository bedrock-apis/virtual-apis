import { expect, suite, test } from 'vitest';
import { testType } from '../tests.helper';
import { NumberType } from './build-ins/number';
import { OptionalType } from './optional';

suite('Optional', () => {
   test('validate', () => {
      const optional = new OptionalType(NumberType.default);

      expect(() => testType(optional, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native optional type conversion failed.]`,
      );

      expect(() => testType(optional, 10)).not.toThrow();
      expect(() => testType(optional, undefined)).not.toThrow();
      expect(() => testType(optional, null)).not.toThrow();
   });
});
