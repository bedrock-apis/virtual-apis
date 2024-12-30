import { MetadataModuleDefinition } from '../../script-module-metadata';
import { compareVersions, fetchJson } from '../helper';
import { IMetadataProvider } from './general';

const BASE_LINK = `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs`;
const REPO_EXISTS_FILE = `exist.json`;

export class OnlineMetadataProvider implements IMetadataProvider {
   public readonly branch;
   public data: ExistJson | null = null;
   public constructor(branchTarget: 'stable' | 'preview') {
      this.branch = branchTarget;
   }
   // TODO Return ALL versions
   public async *getMetadataModules(): AsyncIterable<MetadataModuleDefinition> {
      const data = (this.data = await fetchJson<ExistJson>(`${BASE_LINK}/${this.branch}/${REPO_EXISTS_FILE}`));

      if (!data) {
         console.error('Failed to fetch repository from ' + REPO_EXISTS_FILE);
         return -1;
      }

      if (!data.flags.includes('SCRIPT_MODULES_MAPPING') || !data.SCRIPT_MODULES_MAPPING) {
         console.error('Generator version mismatch with BDS-DOCS!!!, "SCRIPT_MODULES_MAPPING" is not available');
         return -1;
      }

      console.log('Fetching from version: ' + data['build-version']);

      const metadata = data.SCRIPT_MODULES_MAPPING;
      for (const meta of metadata.script_modules) {
         if (!meta.startsWith('@minecraft')) continue;
         const info = metadata.script_modules_mapping[meta];
         if (!info) continue;

         const { name, versions } = info;
         const version = versions.sort(compareVersions).at(-1);
         if (!version) continue;
         const file = `@minecraft/${name}_${version}.json`;
         if (!metadata.script_module_files.includes(file)) {
            console.warn('Failed to build right file name: ' + file, metadata.script_module_files);
            continue;
         }

         const link = `${BASE_LINK}/${this.branch}/metadata/script_modules/${file}`;
         const data = await fetchJson<MetadataModuleDefinition>(link);
         if (!data) {
            console.warn('Failed to fetch and parse JSON data');
            continue;
         }
         yield data;
      }
   }
}

type ExistJson = {
   'build-version': string;
   'version': string;
   'flags': string[];
   'SCRIPT_MODULES_MAPPING'?: {
      script_modules: string[];
      script_modules_mapping: {
         [key: string]: {
            name: string;
            uuid: string;
            versions: string[];
         };
      };
      script_module_files: string[];
   };
};
