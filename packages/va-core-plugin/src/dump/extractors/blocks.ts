import { runThread } from '@bedrock-apis/va-bds-dumps/mc-api';
import { BlockPermutation, BlockTypes } from '@minecraft/server';
import type { BlocksDataReport } from '../provider';

type BlockData = BlocksDataReport['blocks'][string];

export function blocksReport() {
   return runThread(blockReportJob());
}

function* blockReportJob() {
   let lastIndex = 0;
   const map = new Map<string, number>();
   const blocks: Record<string, BlockData> = {};
   for (const { id } of BlockTypes.getAll()) {
      const permutation = BlockPermutation.resolve(id);
      const data: BlockData = (blocks[id] = { tags: [] });
      for (const tag of permutation.getTags()) {
         let index = map.get(tag) ?? null;
         if (index === null) {
            map.set(tag, (index = lastIndex++));
         }
         data.tags.push(index);
      }
      yield;
   }
   return { tags: Array.from(map.keys()), blocks } satisfies BlocksDataReport;
}
