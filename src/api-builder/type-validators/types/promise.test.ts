import { expect, suite, test } from 'vitest';
import { Kernel } from '../../kernel';
import { Type } from '../type';
import { PromiseType } from './promise';
import { ValidateThrow } from './helper.test';

suite('PromiseType', () => {
   test('Promise', () => {
      const type = new PromiseType();
      expect(() => ValidateThrow(type, new Promise(() => {}))).not.toThrow();
      expect(() =>
         ValidateThrow(
            type,
            Kernel.Construct('Promise', () => {}),
         ),
      ).not.toThrow();
   });

   test('Not A Promise', () => {
      const type = new PromiseType();
      expect(() => ValidateThrow(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, 10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, undefined)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, false)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, { then() {}, catch() {}, finally() {} })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
});
