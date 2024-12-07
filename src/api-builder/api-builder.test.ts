import { describe, expect, expectTypeOf, it, test } from 'vitest';
import { ClassDefinition } from './class-definition';

const EntityDefinition = new ClassDefinition('Entity', null).addMethod('methodA');
const PlayerDefinition = new ClassDefinition('Player', EntityDefinition, true, true).addMethod('methodB');

describe('Base API', () => {
  it('Construction', () => {
    let test: string | null = null;
    EntityDefinition.onConstruct.subscribe((handle, cache, definition, params) => {
      test = 'Constructed';
    });

    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = new Player();

    expect(player).toBeInstanceOf(Player);
    expect(player).toBeInstanceOf(Entity);
    expect(EntityDefinition.isThisType(player)).toBeTruthy();
    expect(test).toEqual('Constructed');
  });

  it('Native Construction', () => {
    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = EntityDefinition.construct([])[0];

    expect(player).not.toBeInstanceOf(Player);
    expect(player).not.toBeInstanceOf(Entity);
    expect(player).not.toBeInstanceOf(Object);
    expect(() => Player.prototype.methodA.call(player));
  });

  it('Methods', () => {
    const player = new PlayerDefinition.apiClass();
    expectTypeOf(player.methodA).toBeFunction;
    expectTypeOf(player.methodB).toBeFunction;
    expect(player.methodA).toThrowErrorMatchingInlineSnapshot(
      `[ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.]`,
    );
    expect(player.methodA.bind(player));
  });

  test('Error stack traces', () => {
    const player = new PlayerDefinition.apiClass();

    try {
      player.methodA.call(undefined);
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`[ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.]`);
      expect(e.stack).toMatchInlineSnapshot(`
        "ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.
            at Function.Construct (C:\\fake-api\\src\\api-builder\\kernel.js:9:38)
            at Object.BoundToPrototype (C:\\fake-api\\src\\api-builder\\errors.ts:24:19)
            at methodA (C:\\fake-api\\src\\api-builder\\api-builder.ts:58:22)
            at Object.apply (C:\\fake-api\\src\\api-builder\\api-builder.ts:87:16)
            at C:\\fake-api\\src\\api-builder\\api-builder.test.ts:51:22
            at file:///C:/fake-api/node_modules/.pnpm/@vitest+runner@2.1.8/node_modules/@vitest/runner/dist/index.js:146:14
            at file:///C:/fake-api/node_modules/.pnpm/@vitest+runner@2.1.8/node_modules/@vitest/runner/dist/index.js:533:11
            at runWithTimeout (file:///C:/fake-api/node_modules/.pnpm/@vitest+runner@2.1.8/node_modules/@vitest/runner/dist/index.js:39:7)
            at runTest (file:///C:/fake-api/node_modules/.pnpm/@vitest+runner@2.1.8/node_modules/@vitest/runner/dist/index.js:1056:17)
            at processTicksAndRejections (node:internal/process/task_queues:95:5)"
      `);
    }
  });
});
