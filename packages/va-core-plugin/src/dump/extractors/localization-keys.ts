import { loadChunk } from '@bedrock-apis/va-bds-dumps/mc-api';
import { runThreadAsync } from '@bedrock-apis/va-common/async-thread';
import {
   Block,
   BlockTypes,
   EntityTypes,
   ItemStack,
   ItemTypes,
   system,
   VanillaEntityIdentifier,
   world,
} from '@minecraft/server';
import type { LocalizationKeysReport } from '../provider';

export async function langReporter(): Promise<LocalizationKeysReport> {
   return runThreadAsync(localizationKeysJob(), system.runJob.bind(system));
}

function* localizationKeysJob() {
   const dimension = world.getDimension('overworld');
   const block = (yield loadChunk({ x: 0, y: 0, z: 0 }, 'localizationKey')) as Block;

   const data: LocalizationKeysReport = {
      blocks: {},
      entities: {},
      items: {},
   };

   for (const { id } of BlockTypes.getAll()) {
      block.setType(id);
      data.blocks[id] = block.localizationKey;
      yield;
   }

   for (const { id } of ItemTypes.getAll()) {
      if (id === 'minecraft:air') {
         console.warn('[LocalizationKeys Generator] Skipping ' + id);
         continue;
      }
      data.items[id] = new ItemStack(id).localizationKey;
      yield;
   }

   for (const { id } of EntityTypes.getAll()) {
      try {
         const entity = dimension.spawnEntity(id as VanillaEntityIdentifier, { x: 0, y: 0, z: 0 });
         data.entities[id] = entity.localizationKey;
         entity.remove();
      } catch (e) {
         data.entities[id] = 'ERROR ' + e;
      }
      yield;
   }

   return data;
}
