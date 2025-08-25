import { MetadataType } from '@bedrock-apis/types';
import { expect, suite, test } from 'vitest';
import { DiagnosticsStackReport } from '../../diagnostics';
import { testCreateModuleContext, testType } from '../../tests.helper';
import { DynamicType } from './dynamic';
import { StringType } from './string';

suite('DynamicType', () => {
   test('Dynamic', () => {
      const type = new DynamicType();
      expect(() => type.validate(new DiagnosticsStackReport(), null)).toThrowErrorMatchingInlineSnapshot(
         `[Error: Failed to call validate on unresolved DynamicType ]`,
      );

      type.setType(new StringType());
      expect(() => testType(type, '')).not.toThrow();
      expect(() => testType(type, undefined)).toThrowErrorMatchingInlineSnapshot(
         `[TypeError: Native type conversion failed.]`,
      );
   });
   test('Dynamic Type Registration', () => {
      const context = testCreateModuleContext();
      const ref = { is_bind_type: true, name: 'unregistered' } as unknown as MetadataType;
      const type = context.resolveType(ref);
      expect(type).toBeInstanceOf(DynamicType);
      expect(context.resolveType(ref)).toEqual(type);
   });
});
