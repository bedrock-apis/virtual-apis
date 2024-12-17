import { expect, suite, test } from 'vitest';
import { Type } from '../type';
import { MapType } from './map';
import { NumberType } from './number';
import { StringType } from './string';
import { ValidateThrow } from './helper.test';

suite('MapType', () => {
   test('Map', () => {
      const type = new MapType(new StringType(), new NumberType({ max: 10, min: 0 }));

      expect(() => ValidateThrow(type, {})).not.toThrow();
      expect(() => ValidateThrow(type, { key: 0 })).not.toThrow();
      expect(() => ValidateThrow(type, { key: 1 })).not.toThrow();
      expect(() => ValidateThrow(type, undefined)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, 2)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, false)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, { key: -10 })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, { key: 'value' })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, { key: null })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, { key: undefined })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );

      const symbol = Symbol();
      expect(() => ValidateThrow(type, { [symbol]: 0 })).not.toThrow();
      expect(() => ValidateThrow(type, { 0: 0 })).not.toThrow(); // 0 is converted into string type;
   });
});
