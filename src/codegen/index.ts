import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { exit } from 'node:process';
import { generateModule } from './codegen';
import { MetadataModuleDefinition } from './ScriptModule';

Main().then(exit, e => {
  console.error(e);
  exit(-1);
});

async function Main(): Promise<number> {
  // Fetch Latest Metadata
  const response = await fetch(
    `https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/${'preview'}/metadata/script_modules/@minecraft/server_1.1.0.json`,
  );

  // Check for validity
  if (!response.ok) {
    console.error('Failed to fetch metadata');
    return -1;
  }

  // JSON Parsed metadata
  const metadata = (await response.json()) as MetadataModuleDefinition;
  const moduleName = metadata.name.split('/')[1] ?? null;

  if (!moduleName) {
    console.error(`Failed to generate files for ${metadata.name}, invalid module name`);
    return -1;
  }

  // Execute Code Gen
  const { definitionsCode, exportsCode } = await generateModule(metadata, moduleName);

  if (!existsSync('./bin')) {
    await mkdir('./bin/');
  }

  await writeFile(`./bin/${moduleName}.js`, exportsCode);
  await writeFile(`./bin/${moduleName}.native.js`, definitionsCode);

  // 0 Is success otherwise false
  return 0;
}
