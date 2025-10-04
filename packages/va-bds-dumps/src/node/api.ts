import { Marshaller } from '@bedrock-apis/va-binary';
import { VaEventEmitter } from '@bedrock-apis/va-common';
import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';
import zlib from 'node:zlib';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DumpProvider<T = any> {
   public static async saveResultToOutputFolder(providers: DumpProvider[], bdsFolder: string, outputFolder: string) {
      for (const provider of providers) {
         await provider.saveResultToOutputFolder(bdsFolder, outputFolder);
      }
   }

   public constructor(
      public readonly id: string,
      protected readonly importMetaDirname: string,
      protected readonly saveResultToOutputFolder: (bdsFolder: string, outputFolder: string) => Promise<void>,
      protected readonly onExtract: (folder: string) => Promise<T>,
      protected readonly marshaller: Marshaller<T>,
   ) {}

   protected getImagePath(basePath = this.importMetaDirname) {
      return path.resolve(basePath, this.id + '.gz');
   }

   public onRead = new VaEventEmitter<[T]>();

   public async writeImage(output: string, imagesFolder?: string): Promise<void> {
      const startupTime = performance.now();
      const image = this.marshaller.write(await this.onExtract(output));
      const gzipped = await util.promisify(zlib.gzip)(image);
      await fs.writeFile(this.getImagePath(imagesFolder), gzipped);

      console.log(
         `✅ Write report ${this.id}\n📦 Size: ->`,
         Number((image.length / 1024).toFixed(2)),
         'kb\n📦 Gzip: ->',
         Number((gzipped.length / 1024).toFixed(2)),
         'kb\n⌚ Time:',
         ~~(performance.now() - startupTime),
         'ms\n',
      );
      return;
   }

   public async read(imagesFolder?: string): Promise<T> {
      const gzipped = await fs.readFile(this.getImagePath(imagesFolder));
      const binary = await util.promisify(zlib.gunzip)(gzipped);
      const data = this.marshaller.read(binary);
      this.onRead.invoke(data);
      return data;
   }
}

export class DumpProviderScriptApi<T extends Record<string, object> = Record<string, object>> extends DumpProvider<T> {
   public constructor(
      id: string,
      importMetaDirname: string,
      protected readonly reports: (keyof T)[],
      public readonly scriptApiCodePath: string,
      marshaller: Marshaller<T>,
   ) {
      super(
         id,
         importMetaDirname,
         async () => {
            // mv reports/id -> output/reports/id
            // reports are already written to the output dir
         },
         async output => {
            // return readFile(output/reports/id)
            const obj = {} as Record<keyof T, object>;
            for (const report of reports) {
               obj[report] = JSON.parse(
                  await fs.readFile(path.join(output, 'report', `${report as string}.json`), 'utf8'),
               );
            }
            return obj as T;
         },
         marshaller,
      );
   }
}
