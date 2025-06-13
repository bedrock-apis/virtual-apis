import { runClassic } from 'eslint-vitest-rule-tester';
import rule from './no-global';

runClassic('no-global', rule, {
   valid: [{ code: `const map = new Kernel['globalThis::Map']()` }],
   invalid: [
      {
         code: 'const map = new Map()',
         errors: [{ messageId: 'useKernel', column: 17, endColumn: 20 }],
         output: `const map = new Kernel['globalThis::Map']()`,
      },
      {
         code: 'Object.assign({}, {})',
         errors: [{ messageId: 'useKernel', column: 1, endColumn: 7 }],
         output: `Kernel['Object::static'].assign({}, {})`,
      },
   ],
});
