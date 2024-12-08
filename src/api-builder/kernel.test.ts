import { expect, expectTypeOf, suite, test } from 'vitest';
import { Kernel } from './kernel';

suite('Kernel', () => {
  test('Construct', () => {
    expectTypeOf(Kernel.Construct('Number')).toEqualTypeOf<Number>();
  });

  test('Prototype Isolation', () => {
    const normalMap = new (Kernel.Constructor('Map'))();
    const kernelMap = new Kernel['globalThis::Map']();
    const kernelConstructedMap = Kernel.Construct('Map');

    expect(kernelConstructedMap).not.toBeInstanceOf(Map);
    expect(delete (Kernel['Map::constructor']['prototype'] as any)['set']).toBe(true); // Prototype modification emulation

    try {
      expect(() => normalMap.set('Test', 'Test1')).toThrow();
      expect(() => kernelMap.set('Test', 'Test3')).toThrow();
      expect(() => kernelConstructedMap.set('Test', 'Test2')).not.toThrow();
    } finally {
      Kernel['Map::constructor']['prototype']['set'] = Kernel['Map::prototype']['set'];
    }
  });

  test('Array Prototype Isolation', () => {
    const normalArray = [];
    const kernelArray = Kernel.Construct('Array') as number[];

    expect(delete (Kernel['Array::constructor']['prototype'] as any)['push']).toBe(true); // Prototype modification emulation

    try {
      expect(() => normalArray.push(1)).toThrow();
      expect(() => kernelArray.push(1)).not.toThrow();
    } finally {
      Kernel['Array::constructor']['prototype']['push'] = Kernel['Array::prototype']['push'];
    }
  });
});
