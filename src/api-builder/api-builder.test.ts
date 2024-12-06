import { describe, expect, it } from 'vitest';
import { ClassDefinition } from './class-definition';

describe('tes', () => {
  it('should construct everything', () => {
    const EntityDefinition = new ClassDefinition('Entity', null).addMethod('methodA');
    const PlayerDefinition = new ClassDefinition('Player', EntityDefinition).addMethod('methodB');

    // its hardcoded to be like this for now
    (PlayerDefinition as any).hasConstructor = true;

    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = new Player();

    expect(player).toBeInstanceOf(Player);
    expect(player).toBeInstanceOf(Entity);
    expect(player.methodA()).toMatchInlineSnapshot();
    expect(player.methodB()).toMatchInlineSnapshot();
  });
});
