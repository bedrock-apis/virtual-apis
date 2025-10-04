import { DumpProviderScriptApi } from '@bedrock-apis/va-bds-dumps/api';
import { JsonMarshaller } from '@bedrock-apis/va-binary';
import { resolve } from 'node:path';

export interface BlocksDataReport {
   tags: string[];
   components: { typeId: string; data: object }[];
   blocks: Record<
      string,
      {
         tags: number[];
         localizationKey: string;
         components: number[];
      }
   >;
}

export interface ItemsDataReport {
   tags: string[];
   components: { typeId: string; data: object }[];
   items: Record<
      string,
      {
         tags: number[];
         maxAmount: number;
         components: number[];
         localizationKey: string;
         weight: number;
      }
   >;
}

export interface EntitiesDataReport {
   components: { typeId: string; data: object }[];
   entities: Record<
      string,
      {
         localizationKey: string;
         components: number[];
      }
   >;
}

export type CorePluginVanillaDataReport = {
   items: ItemsDataReport;
   blocks: BlocksDataReport;
   entities: EntitiesDataReport;
};

export const corePluginVanillaDataProvider = new DumpProviderScriptApi<CorePluginVanillaDataReport>(
   'core-plugin-vanilla-data',
   import.meta.dirname,
   ['blocks', 'items', 'entities'],
   resolve(import.meta.dirname, './bds.js'),
   new JsonMarshaller(),
);
