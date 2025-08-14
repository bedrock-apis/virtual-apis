import { expect, suite, test } from 'vitest';
import { testType } from '../../tests.helper';
import { MapType } from './map';
import { NumberType } from './number';

suite('MapType', () => {
   test('Map', () => {
      const type = new MapType(new NumberType({ max: 10, min: 0 }));

      expect(() => testType(type, {})).not.toThrow();
      expect(() => testType(type, { key: 0 })).not.toThrow();
      expect(() => testType(type, { key: 1 })).not.toThrow();
      expect(() => testType(type, undefined)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, null)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, 'string')).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, 2)).toThrowErrorMatchingInlineSnapshot(`[TypeError: Native type conversion failed.]`);
      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, false)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, { key: -10 })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, { key: 'value' })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, { key: null })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
      expect(() => testType(type, { key: undefined })).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );

      const symbol = Symbol();
      expect(() => testType(type, { [symbol]: 0 })).not.toThrow();
      expect(() => testType(type, { 0: 0 })).not.toThrow(); // 0 is converted into string type;
   });
});
