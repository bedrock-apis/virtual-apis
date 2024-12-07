import { expect, expectTypeOf, suite, test, vi } from 'vitest';
import { ClassDefinition } from './class-definition';
import { Kernel } from './kernel';

const EntityDefinition = new ClassDefinition('Entity', null).addMethod('methodA');
const PlayerDefinition = new ClassDefinition('Player', EntityDefinition, true, true).addMethod('methodB');

const Player = PlayerDefinition.apiClass;
const Entity = EntityDefinition.apiClass;

suite('Base API', () => {
  test('Construction', () => {
    const mock = vi.fn();
    EntityDefinition.onConstruct.subscribe(mock);

    const player = new Player();

    expect(player).toBeInstanceOf(Player);
    expect(player).toBeInstanceOf(Entity);
    expect(EntityDefinition.isThisType(player)).toBeTruthy();
    expect(mock).toHaveBeenCalledOnce();
  });

  test('Native Construction', () => {
    const player = EntityDefinition.construct([])[0];

    expect(player).not.toBeInstanceOf(Player);
    expect(player).not.toBeInstanceOf(Entity);
    expect(player).not.toBeInstanceOf(Object);
    expect(() => Player.prototype.methodA.call(player));
  });

  test('Normal Constructor', () => {
    const Player = PlayerDefinition.apiClass;

    expect(new Player()).toBeInstanceOf(Player);
  });

  test('Methods', () => {
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
      expect(e).toBeInstanceOf(Kernel.Constructor('ReferenceError'));
      expect(e).toBeInstanceOf(ReferenceError);
      expect(e).toMatchInlineSnapshot(
        `[ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.]`,
      );
    }
  });
});
