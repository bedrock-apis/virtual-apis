import { loadChunk } from '@bedrock-apis/va-bds-dumps/mc-api';
import { IndexedCollector, runThreadAsync } from '@bedrock-apis/va-common';
import { Block, BlockPermutation, BlockTypes, system } from '@minecraft/server';
import type { BlocksDataReport } from '../provider';

type BlockData = BlocksDataReport['blocks'][string];

export function blocksReport() {
   return runThreadAsync(blockReportJob(), system.runJob.bind(system));
}

function* blockReportJob() {
   const tags = new IndexedCollector<string>(k => k);
   const components = new IndexedCollector<{ typeId: string; data: object }>();
   const map = new Map<string, number>();

   const block = (yield loadChunk({ x: 0, y: 0, z: 0 }, 'localizationKey')) as Block;

   const blocks: Record<string, BlockData> = {};

   for (const { id } of BlockTypes.getAll()) {
      const permutation = BlockPermutation.resolve(id);
      block.setPermutation(permutation);

      blocks[id] = {
         tags: permutation.getTags().map(e => tags.getIndexFor(e)),
         components: [],
         localizationKey: block.localizationKey,
      };
      yield;
   }
   return { tags: Array.from(map.keys()), components: components.getArrayAndLock(), blocks } satisfies BlocksDataReport;
}
