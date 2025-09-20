import { describe, it } from 'vitest';

// This code will be part of the core plugin not context it self
describe('Context', () => {
   it('should sort subscribers', () => {
      /*
      const context = new Context();

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      context.implement('mod1', 'id1', fn1, 1);
      context.implement('mod1', 'id1', fn2, -1);
      context.implement('mod1', 'id1', fn3, 0);
      context.implement('mod1', 'id1', fn3, 3);
      context.implement('mod1', 'id1', fn3, 5);
      context.implement('mod1', 'id1', fn3, 6);
      context.implement('mod1', 'id1', fn3, -3);

      expect(
         context.implementations
            .get('mod1')!
            .get('id1')
            ?.map(e => e.priority)
            .join(' '),
      ).toMatchInlineSnapshot(`"6 5 3 1 0 -1 -3"`);*/
   });

   it('should sort subscribers2', () => {
      /*
      const context = new Context();

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      context.implement('mod1', 'id1', fn1, 1);
      context.implement('mod1', 'id1', fn2, -1);
      context.implement('mod1', 'id1', fn3, 0);

      expect(
         context.implementations
            .get('mod1')!
            .get('id1')
            ?.map(e => e.priority)
            .join(' '),
      ).toMatchInlineSnapshot(`"1 0 -1"`);*/
   });
});
