/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Entity, ItemStack, world } from '@minecraft/server';
import { TestSuite } from '../suite';

TestSuite.simple('errors')
   .test(() => ItemStack.prototype.getComponents.call(null))
   .test(() => new ItemStack('Yes', 5))
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

   .test(() => world.setTimeOfDay(2147483649))

   // @ts-expect-error
   .test(() => world.setDifficulty('nonexistent')); // more then max type
