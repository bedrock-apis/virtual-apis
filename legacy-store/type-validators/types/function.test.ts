import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { GeneratorType } from './function';

suite('FunctionType', () => {
   test('Generator', () => {
      const type = new GeneratorType();
      expect(() => testType(type, (function* () {})())).not.toThrow();
      expect(() => testType(type, {})).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
