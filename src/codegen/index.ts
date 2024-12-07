import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { exit } from 'node:process';
import { generateModule } from './codegen';
import { MetadataModuleDefinition } from './ScriptModule';

Main().then(exit, e => {
  console.error(e);
  exit(-1);
});

async function Main(): Promise<number> {
  /*
  console.time('fetch start');
  // Fetch Latest Metadata
  const response = await fetch(
    `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/${'stable'}/metadata/script_modules/@minecraft/server_1.17.0-beta.json`,
  );
  console.timeEnd('fetch start');

  // Check for validity
  if (!response.ok) {
    console.error('Failed to fetch metadata');
    return -1;
  }

  console.time('fetch json parse');
  // JSON Parsed metadata
  const metadata = (await response.json()) as MetadataModuleDefinition;*/
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

  // 0 Is success otherwise false
  return 0;
}
