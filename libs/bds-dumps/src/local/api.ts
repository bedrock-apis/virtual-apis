import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BlocksDataReport, ItemsDataReport, LocalizationKeysReport, TestsReport } from '../shared';
import { CACHE_DUMP_OUTPUT, CACHE_DUMP_OUTPUT_JS_MODULES } from './constants';
import { dump } from './dump';

async function readAndMaybeRunBds(file: string): Promise<object> {
   const filepath = path.join(CACHE_DUMP_OUTPUT, file);
   if (!existsSync(filepath)) await dump();

   if (!existsSync(filepath)) {
      throw new Error('No file generated at ' + file + ' even after bds dump');
   }

   return JSON.parse(await fs.readFile(filepath, 'utf-8'));
}

async function readReport(name: string) {
   return readAndMaybeRunBds(path.join('report', name));
}

export const readTestReport = readReport.bind(null, 'tests.json') as () => Promise<TestsReport>;
export const readItemsReport = readReport.bind(null, 'items.json') as () => Promise<ItemsDataReport>;
export const readLocalizationReport = readReport.bind(
   null,
   'localization.json',
) as () => Promise<LocalizationKeysReport>;
export const readBlocksReport = readReport.bind(null, 'blocks.json') as () => Promise<BlocksDataReport>;

// Dev mode only function. No need to be in provider
export async function getOrGenerateMetadataFilepaths(): Promise<[string, string]> {
   const metadata = path.join(CACHE_DUMP_OUTPUT, 'docs/script_modules');
   const jsModules = CACHE_DUMP_OUTPUT_JS_MODULES;
   if (!existsSync(metadata) || !existsSync(jsModules)) await dump();
   if (!existsSync(metadata)) throw new Error('Unable to get metadata at ' + metadata);

   return [metadata, jsModules];
}
