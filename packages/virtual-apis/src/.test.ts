import { expect, suite, test } from 'vitest';
import { Context } from './context/base';
import { ParamsValidator } from './runtime-types';
import { ConstructableSymbol, MethodSymbol, ModuleSymbol } from './symbols';
suite('Create Context', () => {
   const context = new Context();
   const moduleSymbol = new ModuleSymbol().setName('@minecraft/server');
   test('Add class Symbol', () => {
      const EntitySymbol = new ConstructableSymbol();
      EntitySymbol.setName('Entity')
         .setIsConstructable(false)
         .setParams(new ParamsValidator([]))
         .prototypeFields.add(new MethodSymbol().setThisType(EntitySymbol).setName('getComponent'));

      const PlayerSymbol = new ConstructableSymbol();
      PlayerSymbol.setName('Player')
         .setIsConstructable(true)
         .setParams(new ParamsValidator([]))
         .setParent(EntitySymbol);

      moduleSymbol.addSymbol(EntitySymbol, true);
      moduleSymbol.addSymbol(PlayerSymbol, true);
   });

   test('Compile module', () => {
      const { Player, Entity } = moduleSymbol.getRuntimeValue(context) as any;
      expect(Player.__proto__).toBe(Entity);
      expect(Player.prototype).toBeInstanceOf(Entity);
      expect(Player.prototype.getComponent).toBe(Entity.prototype.getComponent);
      expect(Player.name).toBe('Player');
      // Method functions has empty string name
      expect(Player.prototype.getComponent.name).toBe('');
   });

   test('Create new instance', () => {
      expect(() => new (moduleSymbol.getRuntimeValue(context) as any).Entity()).toThrow(
         "No constructor for native class 'Entity'.",
      );
   });
});
