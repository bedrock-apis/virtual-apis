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

      // Whats the behavior of this?
      // TODO: does optional type conversion fails and returns or its reported by NumberType
      // We have to test this behavior with array and variant as well so we know if some of the checks has bigger priority
      /*expect(() => testType(optional, 10000000000)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Provided integer value was out of range.  Value: 10000000000, argument bounds: [-2147483648, 2147483647]]`,
      );*/

      expect(() => testType(optional, 10)).not.toThrow();
      expect(() => testType(optional, undefined)).not.toThrow();
      expect(() => testType(optional, null)).not.toThrow();
   });
});
