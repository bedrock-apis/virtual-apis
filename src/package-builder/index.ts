import { existsSync } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
//import { generateModule } from './codegen';

const REPO_EXISTS = `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/stable/exist.json`;
const OUT_DIR = 'package_bin';
const API_BUILDER = resolve(import.meta.dirname, './api-builder.js');
type ExistJson = {
  'build-version': string;
  'version': string;
  'flags': string[];
  'SCRIPT_MODULES_MAPPING'?: {
    script_modules: string[];
    script_modules_mappings: {
      [key: string]: {
        name: string;
        uuid: string;
        versions: string[];
      };
    };
    script_module_files: string[];
  };
};

Main().then(
  r => (process.exitCode = r),
  e => {
    console.error(e);
    process.exit(-1);
  },
);

async function Main(): Promise<number> {
  // Fetch Latest Metadata
  const exists = await (DownloadAndParseJSON(REPO_EXISTS).catch(e => null) as Promise<ExistJson | null>);

  if (!exists) {
    console.error('Failed to fetch repository from ' + REPO_EXISTS);
    return -1;
  }

  if (!exists.flags.includes('SCRIPT_MODULES_MAPPING') || !exists.SCRIPT_MODULES_MAPPING) {
    console.error('Generator version mismatch with BDS-DOCS!!!, "SCRIPT_MODULES_MAPPING" is not available');
    return -1;
  }

  console.log('Fetching from version: ' + exists['build-version']);

  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR);
    console.log('Created ' + OUT_DIR);
  }

  if (!existsSync(API_BUILDER)) {
    console.log(`Failed to find API builder code file: ` + API_BUILDER);
    return -1;
  }

  const successes = await copyFile(API_BUILDER, resolve(OUT_DIR, './api.js')).then(
    () => true,
    () => false,
  );

  if (!successes) {
    console.error('Failed to copy api builder file to the package destination: ' + API_BUILDER);
    return -1;
  }

  console.log('Copied ' + API_BUILDER);

  console.log(exists.SCRIPT_MODULES_MAPPING.script_modules);

  /*
  // Check for validity
  if (!response.ok) {
    console.error('Failed to fetch metadata');
    return -1;
  }

  console.time('fetch json parse');
  // JSON Parsed metadata
  const metadata = (await response.json()) as MetadataModuleDefinition;
  const metadata = JSON.parse(readFileSync('./data/server_1.15.0-beta.json').toString());
  const moduleName = metadata.name.split('/')[1] ?? null;
  console.timeEnd('fetch json parse');

  if (!moduleName) {
    console.error(`Failed to generate files for ${metadata.name}, invalid module name`);
    return -1;
  }

  console.time('codegen');
  // Execute Code Gen
  const { definitionsCode, exportsCode } = await generateModule(metadata, moduleName, true);
  console.timeEnd('codegen');

  if (!existsSync('./bin')) {
    await mkdir('./bin/');
  }

  await writeFile(`./bin/${moduleName}.js`, exportsCode);
  await writeFile(`./bin/${moduleName}.native.js`, definitionsCode);
  */
  // 0 is success
  return 0;
}

async function DownloadAndParseJSON(link: string): Promise<unknown | null> {
  const response = await fetch(link);

  if (!response.ok) return null;

  return await response.json();
}
