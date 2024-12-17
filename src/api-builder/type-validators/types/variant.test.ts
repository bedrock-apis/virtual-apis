import { expect, suite, test } from 'vitest';
import { Type, VoidType } from '../type';
import { NumberType } from './number';
import { OptionalType } from './optional';
import { StringType } from './string';
import { VariantType } from './variant';
import { ValidateThrow } from './helper.test';

const number = new NumberType({ min: 0, max: 10 });
const string = new StringType();

suite('VariantType', () => {
   test('Variant', () => {
      const type = new VariantType([number, string]);

      expect(() => ValidateThrow(type, 'string')).not.toThrow();
      expect(() => ValidateThrow(type, 5)).not.toThrow();

      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => ValidateThrow(type, 12)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, -10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant Optional', () => {
      const type = new VariantType([number, new OptionalType(string)]);

      expect(() => ValidateThrow(type, 5)).not.toThrow();
      expect(() => ValidateThrow(type, undefined)).not.toThrow();
      expect(() => ValidateThrow(type, null)).not.toThrow();
      expect(() => ValidateThrow(type, 'string')).not.toThrow();

      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => ValidateThrow(type, 12)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => ValidateThrow(type, -10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant Void', () => {
      const type = new VariantType([new VoidType(), string]);

      expect(() => ValidateThrow(type, 'string')).not.toThrow();
      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant All', () => {
      const type = new VariantType([new VoidType(), string, new OptionalType(number)]);

      expect(() => ValidateThrow(type, 'string')).not.toThrow();
      expect(() => ValidateThrow(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });
});
