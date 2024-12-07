import { expect, expectTypeOf, suite, test } from 'vitest';
import { Kernel } from './kernel';

suite('Kernel', () => {
  test('Construct', () => {
    expectTypeOf(Kernel.Construct('Number'));
  });
  test('Prototype Isolation', () => {
    try {
      const map1 = new (Kernel.Constructor('Map'))();
      const map2 = Kernel.Construct('Map');
      const map3 = new Kernel['globalThis::Map']();

      expect(delete (Kernel['Map::constructor']['prototype'] as any)['set']).toBe(true); // Prototype modification emulation

      expect(() => map1.set('Test', 'Test1')).toThrow();
      expect(() => map2.set('Test', 'Test2'));
      expect(() => map3.set('Test', 'Test3')).toThrow();
    } catch (e) {
      throw e;
    } finally {
      Kernel['Map::constructor']['prototype']['set'] = Kernel['Map::prototype']['set'];
    }
  });
});
