import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { GeneratorType } from './function';
import { ValidateThrow } from './helper.test';

suite('FunctionType', () => {
   test('Generator', () => {
      const type = new GeneratorType();
      expect(() => ValidateThrow(type, (function* () {})())).not.toThrow();
      expect(() => ValidateThrow(type, {})).toThrowErrorMatchingInlineSnapshot(`[TypeError: Native type conversion failed.]`);
   });
});
