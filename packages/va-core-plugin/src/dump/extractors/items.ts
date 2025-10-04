import { runThread } from '@bedrock-apis/va-bds-dumps/mc-api';
import { IndexedCollector } from '@bedrock-apis/va-common';
import { ItemStack, ItemTypes } from '@minecraft/server';
import type { ItemsDataReport } from '../provider';

type ItemData = ItemsDataReport['items'][string];

export function itemsReport() {
   return runThread(itemStackJob());
}

function* itemStackJob() {
   const tags = new IndexedCollector<string>(k => k);
   const componentsCollector = new IndexedCollector<{ typeId: string; data: object }>(JSON.stringify);
   const items: Record<string, ItemData> = {};
   for (const { id } of ItemTypes.getAll()) {
      if (id === 'minecraft:air') {
         console.warn('[ItemData Generator] Skipping ' + id);
         continue;
      }
      const itemStack = new ItemStack(id);
      const components: ItemData['components'] = [];
      for (const { typeId } of itemStack.getComponents()) {
         components.push(componentsCollector.getIndexFor({ typeId, data: {} }));
      }

      items[id] = {
         tags: itemStack.getTags().map(e => tags.getIndexFor(e)),
         maxAmount: itemStack.maxAmount,
         localizationKey: itemStack.localizationKey,
         weight: itemStack.weight,
         components: components,
      };
      yield;
   }
   return {
      tags: tags.getArrayAndLock(),
      components: componentsCollector.getArrayAndLock(),
      items,
   } satisfies ItemsDataReport;
}
