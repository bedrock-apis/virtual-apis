import { describe, expect, expectTypeOf, it } from 'vitest';
import { ClassDefinition } from './class-definition';

const EntityDefinition = new ClassDefinition('Entity', null).addMethod('methodA');
const PlayerDefinition = new ClassDefinition('Player', EntityDefinition, true, true).addMethod('methodB');

describe('Base API', () => {
  it('Construction', () => {
    let test: string | null = null;
    EntityDefinition.onConstruct.subscribe((handle, cache, definition, params)=>{
      test = "Constructed";
    });

    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = new Player;

    expect(player).toBeInstanceOf(Player);
    expect(player).toBeInstanceOf(Entity);
    expect(EntityDefinition.isThisType(player)).toBeTruthy();
    expect(test).toEqual("Constructed");
  });

  it('Native Construction', () => {
    const Player = PlayerDefinition.apiClass;
    const Entity = EntityDefinition.apiClass;

    const player = EntityDefinition.construct([])[0];

    expect(player).not.toBeInstanceOf(Player);
    expect(player).not.toBeInstanceOf(Entity);
    expect(player).not.toBeInstanceOf(Object);
    expect(()=>Player.prototype.methodA.call(player));
  });
  
  it('Methods', ()=>{
    const player = new PlayerDefinition.apiClass;
    expectTypeOf(player.methodA).toBeFunction;
    expectTypeOf(player.methodB).toBeFunction;
    expect(player.methodA).toThrowError(ReferenceError);
    expect(player.methodA.bind(player));
  });
});
