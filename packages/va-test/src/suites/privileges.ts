import { ItemStack, system, world } from '@minecraft/server';
import { TestSuite } from '../suite';

TestSuite.simple('privileges')
   .test(() => {
      new ItemStack('minecraft:apple');
   })
   .test(() => system.run(() => {}))
   .test(() => world.afterEvents.blockExplode.subscribe(() => {}))
   .runEarlyExecution();
