/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Entity, ItemStack, ScoreboardIdentity, world } from '@minecraft/server';
import { placeBlock, spawnEntity } from '../main';
import { TestSuite } from '../suite';

TestSuite.simple('errors').tests([
   () => ItemStack.prototype.getComponents.call(null),
   () => new ItemStack('Yes', 5),

   // @ts-expect-error
   () => new ItemStack('Yes', 'wrong type'),
   // @ts-expect-error
   () => new ItemStack('Yes', 5, 5),
   // @ts-expect-error
   () => new Entity(),

   // @ts-expect-error
   () => new Entity('Yes', 5, 5),
   () => new ItemStack('minecraft:apple', 65),
   () => new ItemStack('minecraft:apple', 128),
   () => new ItemStack('minecraft:apple', 344),
   () => new ItemStack('minecraft:apple', 1000000),
   () => new ItemStack('minecraft:apple', 112319249219),

   // @ts-expect-error
   () => world.afterEvents.buttonPush.subscribe('not a function'),

   () => world.afterEvents === world.afterEvents,
   () => world.afterEvents.worldLoad === world.afterEvents.worldLoad,

   // more then max type
   () => world.setTimeOfDay(2147483649),

   // @ts-expect-error
   () => world.setDifficulty('nonexistent'),
   () => set('value', spawnEntity('minecraft:cow')),
   () => set(235, spawnEntity('minecraft:cow')),
   () => set('value', null),
   () => set(235, null),
   () => set('value', placeBlock('minecraft:stone')),
   () => set(235, placeBlock('minecraft:stone')),

   () => invalidEntity().addTag('tag'),
   () => (invalidEntity().nameTag = ''),

   // @ts-expect-error
   () => (invalidEntity().scoreboardIdentity = ScoreboardIdentity.prototype),
   // @ts-expect-error
   () => (invalidEntity().isValid = true),
]);

function set(v: unknown, reciever: unknown) {
   const t = spawnEntity('minecraft:cow');
   const prop = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(t), 'nameTag');
   return prop?.set?.call(reciever, v);
}

function invalidEntity() {
   const entity = spawnEntity('minecraft:cow');
   entity.remove();
   return entity;
}
