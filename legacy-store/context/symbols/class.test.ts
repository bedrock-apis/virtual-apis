import { describe, expect, it } from 'vitest';
import { testCreateModuleContext } from '../../tests.helper';
import { ParamsDefinition, VoidType } from '../../type-validators';
import { ClassAPISymbol } from './class';
import { EnumAPISymbol } from './enum';
import { MethodAPISymbol } from './method';

describe('ClassAPISymbol', () => {
   it('should cache compile', () => {
      const ctx = testCreateModuleContext();
      const enm = new EnumAPISymbol(ctx, 'enum', [
         ['key', 'value'],
         ['key 2', 'value 2'],
      ]);
      expect(enm.api).toMatchInlineSnapshot(`
        {
          "key": "value",
          "key 2": "value 2",
        }
      `);

      const cls = new ClassAPISymbol(ctx, 'class');
      cls.methods.push(new MethodAPISymbol(ctx, 'method', cls, new ParamsDefinition(), new VoidType()));
      expect(cls.api).toBeTypeOf('function');
   });
});
