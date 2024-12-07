import { expect, expectTypeOf, suite, test } from 'vitest';
import { Kernel } from './kernel';

suite('Kernel', () => {
  test('Construct', () => {
    expectTypeOf(Kernel.Construct('Number'));
  });
  test('Prototype Isolation', () => {
    const map1 = new (Kernel.Constructor('Map'))();
    const map2 = Kernel.Construct('Map');
    const map3 = new Kernel['globalThis::Map']();

    expect(delete (Kernel['Map::constructor']['prototype'] as any)['set']).toBe(true); // Prototype modification emulation
    delete (Function.prototype as any).call;

    expect(() => map1.set('Test', 'Test1')).toThrow();
    expect(() => map2.set('Test', 'Test2'));
    expect(() => map3.set('Test', 'Test3')).toThrow();

    Function.prototype.call = Kernel['Function::prototype']['call'];
    Kernel['Map::constructor']['prototype']['set'] = Kernel['Map::prototype']['set'];
  });
});
