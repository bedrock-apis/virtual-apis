import { MetadataModuleDefinition } from '@bedrock-apis/types';
import { glob, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
// import { compareVersions } from '../helper';
import { IMetadataProvider } from './general';

const MODULES_PATH = '@minecraft';

export class SystemFileMetadataProvider implements IMetadataProvider {
   public readonly baseDir;
   public readonly jsBaseDir;
   public constructor(baseDir: string, jsBaseDir: string) {
      this.baseDir = baseDir;
      this.jsBaseDir = jsBaseDir;
   }
   public async *getJSModules(): AsyncIterable<[string, string]> {
      for await (const info of glob(this.jsBaseDir + '/*/*.js')) {
         yield [info.substring(this.jsBaseDir.length), (await readFile(info)).toString()];
      }
   }
   public async *getMetadataModules(): AsyncIterable<MetadataModuleDefinition> {
      const base = path.join(this.baseDir, MODULES_PATH);
      for (const info of await readdir(base, { withFileTypes: true })) {
         if (!info.isFile()) continue;

         const file = path.join(base, info.name);
         const metadata = await readFile(file).then(
            e => e.toString(),
            () => null,
         );

         if (!metadata) console.warn('Failed to read: ' + file);
         else yield JSON.parse(metadata);
      }
   }
}
