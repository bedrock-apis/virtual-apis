import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { MetadataModuleDefinition } from '../../script-module-metadata';
import { compareVersions } from '../helper';
import { IMetadataProvider } from './general';

const MODULES_PATH = '@minecraft';

export class SystemFileMetadataProvider implements IMetadataProvider {
   public readonly baseDir;
   public constructor(baseDir: string) {
      this.baseDir = baseDir;
   }
   public async *getMetadataModules(): AsyncIterable<MetadataModuleDefinition> {
      const base = resolve(this.baseDir, MODULES_PATH);
      const modulesMap = new Map<string, string>();
      for (const info of await readdir(base, { withFileTypes: true })) {
         if (!info.isFile()) continue;
         const [moduleName, versionLike] = info.name.split('_');
         if (!versionLike) continue;
         const version = versionLike.slice(0, versionLike.lastIndexOf('.'));
         if (!moduleName) continue;
         const current = modulesMap.get(moduleName);
         if (!current || compareVersions(current, version) != 1) modulesMap.set(moduleName, version);
      }
      for (const [name, version] of modulesMap.entries()) {
         const file = resolve(base, `${name}_${version}.json`);
         const data = await readFile(file).then(
            e => e.toString(),
            () => null,
         );
         if (!data) {
            console.warn('Failed to read: ' + file);
            continue;
         }
         yield JSON.parse(data);
      }
   }
}
