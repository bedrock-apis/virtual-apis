import { existsSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateModule } from './codegen';
import { MetadataModuleDefinition } from './script-module-metadata';

const baseLink = `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/stable`;
const repoExists = `${baseLink}/exist.json`;
const outDir = 'packages';
const apiFilename = 'api.js';
const apiBuilder = resolve(import.meta.dirname, './api-builder.js');
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

main().then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);

async function main(): Promise<number> {
   // Fetch Latest Metadata
   const exists = await (downloadAndParseJSON(repoExists).catch(e => null) as Promise<ExistJson | null>);

   if (!exists) {
      console.error('Failed to fetch repository from ' + repoExists);
      return -1;
   }

   if (!exists.flags.includes('SCRIPT_MODULES_MAPPING') || !exists.SCRIPT_MODULES_MAPPING) {
      console.error('Generator version mismatch with BDS-DOCS!!!, "SCRIPT_MODULES_MAPPING" is not available');
      return -1;
   }

   console.log('Fetching from version: ' + exists['build-version']);

   if (!existsSync(outDir)) {
      await mkdir(outDir);
      console.log('Created ' + outDir);
   }
   if (!existsSync(resolve(outDir, './@minecraft'))) {
      await mkdir(resolve(outDir, './@minecraft'));
      console.log('Created ' + outDir + './@minecraft');
   }

   if (!existsSync(apiBuilder)) {
      console.log(`Failed to find API builder code file: ` + apiBuilder);
      return -1;
   }

   const successes = await copyFile(apiBuilder, resolve(outDir, apiFilename)).then(
      () => true,
      () => false,
   );

   if (!successes) {
      console.error('Failed to copy api builder file to the package destination: ' + apiBuilder);
      return -1;
   }

   console.log('Copied ' + apiBuilder);

   const metadata = exists.SCRIPT_MODULES_MAPPING;

   const tasks = exists.SCRIPT_MODULES_MAPPING.script_modules
      .filter(e => e.startsWith('@minecraft'))
      .map(e => {
         const { name, versions } = metadata.script_modules_mapping[e];
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         return generateModuleFor(name, versions.sort(compareVersions).at(-1)!);
      });

   if ((await Promise.all(tasks)).find(e => e !== 0) !== undefined) {
      console.error('Failed to generate Metadata for at least on module');
      return -1;
   }

   // 0 is success
   return 0;
}

async function downloadAndParseJSON(link: string): Promise<unknown | null> {
   const response = await fetch(link);

   if (!response.ok) return null;

   return await response.json();
}

function compareVersions(a: string, b: string) {
   const parseVersion = (version: string) =>
      version.split(/[-.]/).map(part => (isNaN(Number(part)) ? part : Number(part)));

   const aParts = parseVersion(a);
   const bParts = parseVersion(b);

   for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      if (aParts[i] === undefined) return -1;
      if (bParts[i] === undefined) return 1;
      if (typeof aParts[i] === 'string' || typeof bParts[i] === 'string') {
         if (aParts[i] > bParts[i]) return 1;
         if (aParts[i] < bParts[i]) return -1;
      } else {
         if (aParts[i] > bParts[i]) return 1;
         if (aParts[i] < bParts[i]) return -1;
      }
   }
   return 0;
}
async function generateModuleFor(name: string, version: string): Promise<number> {
   const builderLink = `${baseLink}/metadata/script_modules/${name}_${version}.json`;

   console.log('Fetching: ' + builderLink);
   const moduleObject = (await downloadAndParseJSON(builderLink).catch(e => null)) as MetadataModuleDefinition;

   if (!moduleObject) {
      console.error('Failed to fetch or parse: ' + builderLink);
      return -1;
   }

   const { definitionsCode, exportsCode } = await generateModule(moduleObject, apiFilename, true);

   await writeFile(resolve(outDir, name + '.native.js'), definitionsCode);
   console.log('Generated ' + resolve(outDir, name + '.native.js'));
   await writeFile(resolve(outDir, name + '.js'), exportsCode);
   console.log('Generated ' + resolve(outDir, name + '.js'));
   console.log(' ');

   return 0;
}
