import { expect, expectTypeOf, it, suite, test } from 'vitest';
import { KernelIterator } from './kernel.iterators';
import { time } from 'console';

suite('Kernel Iterators', () => {
   test('Generator Test', () => {
    const prototype = Object.getPrototypeOf(GeneratorFunction.prototype);
    const next = prototype.next;
    delete prototype.next;
    expect(()=>{
        for(const i of GeneratorFunction()) ;
    }).toThrow();
   });
});

function * GeneratorFunction(){
    yield 5;
}