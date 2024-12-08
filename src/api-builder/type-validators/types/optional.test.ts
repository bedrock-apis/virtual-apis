import { expect, suite, test } from 'vitest';
import { Diagnostics } from '../../errors';
import { fromDefaultType } from '../default';
import { OptionalType } from './optional';

suite('Optional', () => {
   test('validate', () => {
      const optional = new OptionalType(fromDefaultType('int32'));

      const diagnostics = new Diagnostics();
      optional.validate(diagnostics, 'string');
      expect(diagnostics).toMatchInlineSnapshot(`
        Diagnostics {
          "errors": [
            Report {
              "message": "Native optional type conversion failed",
              "type": [Function],
            },
          ],
          "warns": [],
        }
      `);
   });
});
