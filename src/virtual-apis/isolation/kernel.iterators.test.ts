import { expect, suite, test } from 'vitest';

suite('Kernel Iterators', () => {
   test('Generator Test', () => {
      const prototype = Object.getPrototypeOf(GeneratorFunction.prototype);
      const next = prototype.next;
      delete prototype.next;

      try {
         expect(() => {
            for (const i of GeneratorFunction());
         }).toThrow();
      } finally {
         prototype.next = next;
      }
   });
});

function* GeneratorFunction() {
   yield 5;
}
