import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { generatorObjectType } from './generator-object';

suite('FunctionType', () => {
   test('Generator', () => {
      const type = generatorObjectType;
      expect(() => testType(type, (function* () {})())).not.toThrow();
      expect(() => testType(type, {})).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
