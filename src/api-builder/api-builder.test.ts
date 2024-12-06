import { describe, expect, expectTypeOf, it } from 'vitest';
import { ClassDefinition } from './class-definition';

describe('tes', () => {
  it('should construct everything', () => {
    const EntityDefinition = new ClassDefinition('Entity', null).addMethod('methodA');
    const PlayerDefinition = new ClassDefinition('Player', EntityDefinition, true, true).addMethod('methodB');

    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = new Player();

    expect(player).toBeInstanceOf(Player);
    expect(player).toBeInstanceOf(Entity);
    expectTypeOf(player.methodA).toBeCallableWith('string');
    expectTypeOf(player.methodB).toBeFunction;
    expectTypeOf(player.methodB).toBeFunction;
  });
});
