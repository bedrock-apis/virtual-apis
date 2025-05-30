import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { MetadataModuleDefinition } from '@bedrock-apis/types';
// import { compareVersions } from '../helper';
import { IMetadataProvider } from './general';

const MODULES_PATH = '@minecraft';

export class SystemFileMetadataProvider implements IMetadataProvider {
   public readonly baseDir;
   public constructor(baseDir: string) {
      this.baseDir = baseDir;
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
