import { Block, Entity, system, VanillaEntityIdentifier, Vector3, world } from '@minecraft/server';
import { TestEnvironment } from './environment';

export async function loadChunk(location: Vector3, tickingareaName: string) {
   const dimension = world.getDimension('overworld');
   dimension.runCommand(`tickingarea add circle ${location.x} ${location.y} ${location.z} 4 ${tickingareaName}`);

   let runs = 0;
   let block;
   do {
      runs++;
      if (runs >= 100) throw new TypeError('Loading took too long');

      try {
         dimension.setBlockType(location, 'minecraft:bedrock');
         block = dimension.getBlock(location);
      } catch {
         /* empty */
      }
      await system.waitTicks(10);
   } while (!block?.isValid);

   return block;
}

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
