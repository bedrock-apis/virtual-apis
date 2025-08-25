import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { promiseType } from './promise';

suite('PromiseType', () => {
   test('Promise', () => {
      const type = promiseType;
      expect(() => testType(type, new Promise(() => {}))).not.toThrow();
   });

   test('Not A Promise', () => {
      const type = promiseType;
      expect(() => testType(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, 10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, undefined)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, false)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, { then() {}, catch() {}, finally() {} })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
