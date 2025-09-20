import { Marshaller } from '@bedrock-apis/va-binary';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { BlocksDataReport, ItemsDataReport, LocalizationKeysReport, TestsReport } from '../shared';
import { CACHE_DUMP_OUTPUT } from './constants';
export * from '../shared';

async function readAndMaybeRunBds(file: string): Promise<object> {
   const filepath = path.join(CACHE_DUMP_OUTPUT, file);
   //if (!existsSync(filepath)) await dump();

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

export class DumpProvider<T = object> {
   public constructor(
      public readonly id: string,
      public readonly afterBdsDump: (bdsFolder: string, outputFolder: string) => Promise<void>,
      public readonly onExtract: (folder: string) => Promise<T>,
      public readonly marshaller: Marshaller<T>,
   ) {}

   protected getImagePath(basePath = import.meta.url) {
      return resolve(basePath, this.id + '.gz');
   }

   public data?: T;

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
      this.data = this.marshaller.read(await promisify(zlib.gunzip)(await fs.readFile(path)));
      return this.data;
   }
}

export class DumpProviderScriptApi<T extends Record<string, object> = Record<string, object>> extends DumpProvider<T> {
   public constructor(
      id: string,
      public readonly reports: (keyof T)[],
      public readonly scriptApiCodePath: string,
      marshaller: Marshaller<T>,
   ) {
      super(
         id,
         async () => {
            // mv reports/id -> output/reports/id
            // reports are already written to the output dir
         },
         async output => {
            // return readFile(output/reports/id)
            const obj = {} as Record<keyof T, object>;
            for (const report of reports) {
               obj[report] = JSON.parse(await fs.readFile(path.join(output, 'reports', report as string), 'utf8'));
            }
            return obj as T;
         },
         marshaller,
      );
   }
}
