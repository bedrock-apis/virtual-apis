import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TestsReport } from '../shared';
import { CACHE_DUMP_OUTPUT } from './constants';
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

// Dev mode only function. No need to be in provider
export async function getOrGenerateMetadataFilepath(): Promise<string> {
   const metadata = path.join(CACHE_DUMP_OUTPUT, 'docs/script_modules');
   if (!existsSync(metadata)) await dump();
   if (!existsSync(metadata)) throw new Error('Unable to get metadata at ' + metadata);

   return metadata;
}
