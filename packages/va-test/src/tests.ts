import { Block, Entity, system, VanillaEntityIdentifier, world } from '@minecraft/server';
import { TestEnvironment } from './environment';
import { TestSuite } from './suite';

// TODO Replace with import to relative script api generator helper or just move whole file to the script api generator
//import { loadChunk } from '../../../bds-docs/script-api/helper';
import './suites/all';

const loadChunk = Object.create(null);

class BedrockDedicatedServerEnvironment extends TestEnvironment {
   public async onSetup(): Promise<void> {
      await loadChunk({ x: 0, y: 0, z: 0 }, 'test');
   }

   public placeBlock(typeId: string): Block {
      const location = this.getNextLocation('block', { x: 0, y: 0, z: 0 }, 'y');
      world.getDimension('overworld').setBlockType(location, typeId);

      const block = world.getDimension('overworld').getBlock(location);

      if (!block) throw new Error('Unable to place block');

      return block;
   }

   public spawnEntity(typeId: string): Entity {
      const location = this.getNextLocation('entity', { x: 0, y: 0, z: 1 }, 'z');
      const entity = world.getDimension('overworld').spawnEntity(typeId as VanillaEntityIdentifier, location);

      return entity;
   }
}

export function testsResolver() {
   return TestSuite.runThread(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
}
