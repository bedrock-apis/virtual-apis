import { expectTypeOf, suite, test } from 'vitest';
import { Kernel } from './kernel';

suite('Kernel', () => {
  test('Construct', () => {
    expectTypeOf(Kernel.Construct('Number'));
  });
});
