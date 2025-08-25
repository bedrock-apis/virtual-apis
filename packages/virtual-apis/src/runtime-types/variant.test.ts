import { expect, suite, test } from 'vitest';
import { testType } from './../tests.helper';
import { NumberType } from './build-ins/number';
import { OptionalType } from './optional';
import { VariantType } from './variant';
import { stringType } from './build-ins/string';
import { voidType } from './build-ins/void';

const number = new NumberType({ min: 0, max: 10 });
const string = stringType;

suite('VariantType', () => {
   test('Variant', () => {
      const type = new VariantType([number, string]);

      expect(() => testType(type, 'string')).not.toThrow();
      expect(() => testType(type, 5)).not.toThrow();

      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => testType(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => testType(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => testType(type, 12)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => testType(type, -10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant Optional', () => {
      const type = new VariantType([number, new OptionalType(string)]);

      expect(() => testType(type, 5)).not.toThrow();
      expect(() => testType(type, undefined)).not.toThrow();
      expect(() => testType(type, null)).not.toThrow();
      expect(() => testType(type, 'string')).not.toThrow();

      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => testType(type, NaN)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => testType(type, Infinity)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );

      expect(() => testType(type, 12)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
      expect(() => testType(type, -10)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant Void', () => {
      const type = new VariantType([voidType, string]);

      expect(() => testType(type, 'string')).not.toThrow();
      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });

   test('Variant All', () => {
      const type = new VariantType([voidType, string, new OptionalType(number)]);

      expect(() => testType(type, 'string')).not.toThrow();
      expect(() => testType(type, true)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native variant type conversion failed.]`,
      );
   });
});
