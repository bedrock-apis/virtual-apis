/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Entity, ItemStack, world } from '@minecraft/server';
import { placeBlock, spawnEntity } from '../main';
import { TestSuite } from '../suite';

TestSuite.simple('errors')
   .test(() => ItemStack.prototype.getComponents.call(null))
   .test(() => {
      return new ItemStack('Yes', 5);
   })
   // @ts-expect-error
   .test(() => new ItemStack('Yes', 'wrong type'))
   // @ts-expect-error
   .test(() => new ItemStack('Yes', 5, 5))

   // @ts-expect-error
   .test(() => new Entity())
   // @ts-expect-error
   .test(() => new Entity('Yes', 5, 5))

   .test(() => new ItemStack('minecraft:apple', 65))
   .test(() => new ItemStack('minecraft:apple', 128))
   .test(() => new ItemStack('minecraft:apple', 344))
   .test(() => new ItemStack('minecraft:apple', 1000000))
   .test(() => new ItemStack('minecraft:apple', 112319249219))

   .test(() => {
      // @ts-expect-error
      world.afterEvents.buttonPush.subscribe('not a function');
   })

   .test(() => {
      TestSuite.assert(world.afterEvents === world.afterEvents);
      TestSuite.assert(world.afterEvents.buttonPush === world.afterEvents.buttonPush);
   })

   // more then max type
   .test(() => world.setTimeOfDay(2147483649))

   // @ts-expect-error
   .test(() => world.setDifficulty('nonexistent'))

   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 'value', spawnEntity('minecraft:cow')))
   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 235, spawnEntity('minecraft:cow')))
   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 'value', null))
   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 235, null))
   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 'value', placeBlock('minecraft:stone')))
   .test(() => Reflect.set(spawnEntity('minecraft:cow'), 'nameTag', 235, placeBlock('minecraft:stone')));
