import { expect, suite, test } from 'vitest';
import { KernelArray } from './kernel.arrays';

suite('Kernel Iterators', () => {
   test('Array Iterator', () => {
      const array: any[] = [];
      expect(() => [...KernelArray.From(array).getIterator()]).not.toThrow();
   });
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
