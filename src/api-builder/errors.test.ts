import { describe, expect, test } from 'vitest';
import { Diagnostics, Report } from './diagnostics';

describe('Diagnostics', () => {
   test('Report multiple reports', () => {
      const diagnostics = new Diagnostics();

      diagnostics.errors.report(new Report('Message 0', Error));
      diagnostics.errors.report(new Report('Message 1', Error), new Report('Message 2', Error));

      expect(diagnostics.errors.length).toBe(3);
   });
   test('Report with string', () => {
      const diagnostics = new Diagnostics();

      diagnostics.errors.report('Message', Error);

      expect(diagnostics.errors.isEmpty).toBe(false);
   });

   test('Diagnostics', () => {
      expect(() => new Diagnostics().throw()).toThrowErrorMatchingInlineSnapshot(
         `[Error: Failed to throw report error on successful diagnostics instance]`,
      );
   });
});

describe('Report', () => {
   test('Throw', () => {
      const report = new Report('Message', Error);

      function normalize(path: string) {
         return path.replaceAll('\\', '/');
      }

      function getAndNormalizeStack(callback: () => void) {
         try {
            callback();
         } catch (e) {
            if (!(e instanceof Error) || !e.stack) return e;
            return normalize(e.stack)
               .replaceAll(normalize(process.cwd()), 'cwd')
               .replace(/\(?file:\/\/\/?cwd\/node_modules\/.+/g, '<node_modules>')
               .replace(/\n\s+at\s*(runTest|runSuite|runWithTimeout)? <node_modules>/g, '')
               .replace(/\n\s+at\s*.+ \(?node:internal.+\)?/g, '')
               .replace(/\.ts:\d+:\d+/g, '');
         }
      }

      expect(getAndNormalizeStack(() => report.throw())).toMatchInlineSnapshot(`
        "Error: Message
            at cwd/src/api-builder/errors.test
            at getAndNormalizeStack (cwd/src/api-builder/errors.test)
            at cwd/src/api-builder/errors.test"
      `);
      expect(getAndNormalizeStack(() => report.throw(1))).toMatchInlineSnapshot(`
        "Error: Message
            at cwd/src/api-builder/errors.test
            at getAndNormalizeStack (cwd/src/api-builder/errors.test)
            at cwd/src/api-builder/errors.test"
      `);
      expect(getAndNormalizeStack(() => report.throw(2))).toMatchInlineSnapshot(`
        "Error: Message
            at getAndNormalizeStack (cwd/src/api-builder/errors.test)
            at cwd/src/api-builder/errors.test"
      `);
      expect(getAndNormalizeStack(() => report.throw(3))).toMatchInlineSnapshot(`
        "Error: Message
            at cwd/src/api-builder/errors.test"
      `);
   });
});
