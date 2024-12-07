import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import process from 'node:process';
//import { generateModule } from './codegen';

const REPO_EXISTS = `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/stable/exist.json`;

Main().then(
  r => (process.exitCode = r),
  e => {
    console.error(e);
    process.exit(-1);
  },
);

async function Main(): Promise<number> {
  // Fetch Latest Metadata
  const exists = await (DownloadAndParseJSON(REPO_EXISTS).catch(e => null) as Promise<{
    'build-version': string;
    'version': string;
    'flags': string[];
  } | null>);

  if (!exists) {
    console.error('Failed to fetch repository from ' + REPO_EXISTS);
    return -1;
  }

  console.log('Fetching from version: ' + exists['build-version']);

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
