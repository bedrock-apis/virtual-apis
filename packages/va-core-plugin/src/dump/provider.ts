import { DumpProviderScriptApi } from '@bedrock-apis/va-bds-dumps/api';
import { JsonMarshaller } from '@bedrock-apis/va-binary';
import { resolve } from 'node:path';

export interface BlocksDataReport {
   tags: string[];
   blocks: Record<string, { tags: number[] }>;
}

export interface ItemsDataReport {
   tags: string[];
   items: Record<
      string,
      {
         tags: number[];
         maxStack: number;
         components: Record<string, unknown>;
      }
   >;
}

export interface LocalizationKeysReport {
   entities: Record<string, string>;
   items: Record<string, string>;
   blocks: Record<string, string>;
}

export type CorePluginVanillaDataReport = {
   localizationKeys: LocalizationKeysReport;
   items: ItemsDataReport;
   blocks: BlocksDataReport;
};

export const corePluginVanillaDataProvider = new DumpProviderScriptApi<CorePluginVanillaDataReport>(
   'core-plugin-vanilla-data',
   import.meta.dirname,
   ['blocks', 'items', 'localizationKeys'],
   resolve(import.meta.dirname, './bds.js'),
   new JsonMarshaller(),
);
