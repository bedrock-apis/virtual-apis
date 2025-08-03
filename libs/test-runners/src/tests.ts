import { Block, Entity, system, VanillaEntityIdentifier, world } from '@minecraft/server';
import { TestEnvironment } from '../../bds-dumps/src/test-runner/environment';
import { TestSuite } from '../../bds-dumps/src/test-runner/suite';

import { loadChunk } from '../../../bds-docs/script-api/helper';
import '../../bds-dumps/src/test-runner/suites/all';

class BedrockDedicatedServerEnvironment extends TestEnvironment {
   async onSetup(): Promise<void> {
      await loadChunk({ x: 0, y: 0, z: 0 }, 'test');
   }

   placeBlock(typeId: string): Block {
      const location = this.getNextLocation('block', { x: 0, y: 0, z: 0 }, 'y');
      world.getDimension('overworld').setBlockType(location, typeId);

      const block = world.getDimension('overworld').getBlock(location);

      if (!block) throw new Error('Unable to place block');

      return block;
   }

   spawnEntity(typeId: string): Entity {
      const location = this.getNextLocation('entity', { x: 0, y: 0, z: 1 }, 'z');
      const entity = world.getDimension('overworld').spawnEntity(typeId as VanillaEntityIdentifier, location);

      return entity;
   }
}

export function TestsResolver() {
   return TestSuite.r(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
}
