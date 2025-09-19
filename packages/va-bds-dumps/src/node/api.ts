import { MarshalFormat, Marshaller } from '@bedrock-apis/va-binary';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { BlocksDataReport, ItemsDataReport, LocalizationKeysReport, TestsReport } from '../shared';
import { CACHE_DUMP_OUTPUT } from './constants';
import { dump } from './dump';
export * from '../shared';

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
// export async function getOrGenerateMetadataFilepaths(): Promise<[string, string]> {
//    const metadata = path.join(CACHE_DUMP_OUTPUT, 'docs/script_modules');
//    const jsModules = CACHE_DUMP_OUTPUT_JS_MODULES;
//    if (!existsSync(metadata) || !existsSync(jsModules)) await dump();
//    if (!existsSync(metadata)) throw new Error('Unable to get metadata at ' + metadata);

//    return [metadata, jsModules];
// }

export class DumpProvider<T extends MarshalFormat = MarshalFormat> {
   public constructor(
      public readonly id: string,
      public readonly afterBdsDump: (bdsFolder: string, outputFolder: string) => Promise<void>,
      public readonly onExtract: (folder: string) => Promise<T>,
      public readonly marshaller: Marshaller<T>,
   ) {}

   protected getImagePath(basePath = import.meta.url) {
      return resolve(basePath, this.id + '.gz');
   }

   public async writeImage(output: string, imagePath = this.getImagePath()): Promise<void> {
      const startupTime = performance.now();
      const image = this.marshaller.write(await this.onExtract(output));
      const gzipped = await promisify(zlib.gzip)(image);
      await fs.writeFile(imagePath, gzipped);

      console.log(
         `📦 Write ${this.id} Size: ->`,
         Number((image.length / 1024).toFixed(2)),
         'kb, Gzip: ->',
         Number((gzipped.length / 1024).toFixed(2)),
         'kb, ⌚ Time:',
         ~~(performance.now() - startupTime),
         'ms',
      );
      return;
   }

   public async read(path = this.getImagePath()): Promise<T> {
      return this.marshaller.read(await promisify(zlib.gunzip)(await fs.readFile(path)));
   }
}

class DumpProviderScriptApi<T extends MarshalFormat> extends DumpProvider<T> {
   public constructor(id: string, scriptApiCodePath: string, marshaller: Marshaller<T>) {
      super(
         id,
         (bds, output) => {
            // mv reports/id -> output/reports/id
         },
         async output => {
            // return readFile(output/reports/id)
            return 0 as T;
         },
         marshaller,
      );
   }
}

new DumpProviderScriptApi('tests', './test-run-mc.ts', {
   marshal(io) {},
});

function bdsDumpSupported(needBds: string, providers: DumpProvider<MarshalFormat>[]) {
   if (installedBds !== needBds) installBds();
   runBds(bdsFolder);
   for (const provider of providers) {
      provider.afterBdsDump(bdsFolder, outputFolder);
   }
   zipOutput();
   for (const provider of providers) {
      provider.writeImage(outputFolder);
   }
}

function bdsDumpUnsupported() {
   unzipOutput();
   for (const provider of providers) {
      provider.write(outputFolder);
   }
}
