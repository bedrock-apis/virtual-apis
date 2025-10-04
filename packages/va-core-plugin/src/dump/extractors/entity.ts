import { loadChunk, runThread } from '@bedrock-apis/va-bds-dumps/mc-api';
import { IndexedCollector } from '@bedrock-apis/va-common';
import { EntityTypes, world } from '@minecraft/server';
import type { EntitiesDataReport } from '../provider';

type EntityData = EntitiesDataReport['entities'][string];

export async function entitiesReport() {
   await loadChunk({ x: 0, y: 0, z: 0 }, 'va_entity');

   return runThread(entityStackJob());
}

function* entityStackJob() {
   const dimension = world.getDimension('overworld');
   const componentsCollector = new IndexedCollector<{ typeId: string; data: object }>(JSON.stringify);
   const entities: Record<string, EntityData> = {};
   for (const { id } of EntityTypes.getAll()) {
      try {
         const entity = dimension.spawnEntity<string>(id, { x: 0, z: 0, y: 0 });
         const components: EntityData['components'] = [];
         for (const { typeId } of entity.getComponents()) {
            components.push(componentsCollector.getIndexFor({ typeId, data: {} }));
         }

         entities[id] = {
            localizationKey: entity.localizationKey,
            components,
         };
         entity.remove();
      } catch (e) {
         console.error('failed to spawn', id, e);
      }
      yield;
   }
   return { components: componentsCollector.getArrayAndLock(), entities } satisfies EntitiesDataReport;
}
