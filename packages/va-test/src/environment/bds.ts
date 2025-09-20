import { loadChunk } from '@bedrock-apis/va-bds-dumps/mc-api';
import { Block, Entity, VanillaEntityIdentifier, world } from '@minecraft/server';
import { TestEnvironment } from './environment';

export class BedrockDedicatedServerEnvironment extends TestEnvironment {
   public async onSetup(): Promise<void> {
      await loadChunk({ x: 0, y: 0, z: 0 }, 'va');
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
