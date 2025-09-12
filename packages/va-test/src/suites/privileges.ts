import { Difficulty, ItemStack, system, world } from '@minecraft/server';
import { TestSuite } from '../suite';

TestSuite.simple('privileges')
   .test(() => {
      new ItemStack('minecraft:apple');
   })
   .test(() => {
      // What is more prior
      world.setDifficulty(Difficulty.Easy);
   })
   .test(() => {
      world.gameRules.commandBlockOutput = false;
   })
   .test(() => {
      // @ts-expect-error aaaaaaaaaaaa
      world.gameRules.commandBlockOutput = 4;
   })
   .test(() => system.run(() => {}))
   .test(() => world.afterEvents.blockExplode.subscribe(() => {}))
   .runEarlyExecution();
