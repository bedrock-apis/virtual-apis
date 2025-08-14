import { existsSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'rolldown';
import { CACHE_DUMP_DIR, SOURCE_DIR } from './constants';

export async function setupScriptAPI(): Promise<void> {
   const worlds = resolve(CACHE_DUMP_DIR, './worlds');
   if (existsSync(worlds)) await rm(worlds, { recursive: true, force: true });
   await allowAllModules();

   const editorFile = resolve(CACHE_DUMP_DIR, './behavior_packs/editor/scripts/Main.js');
   await prepareManifest();

   const addonEntry = resolve(SOURCE_DIR, './client/main.ts');
   if (!existsSync(addonEntry)) throw new ReferenceError('Failed to found addon entry');

   const output = await build({ input: addonEntry, external: [/^@minecraft.+/] });

   await writeFile(editorFile, '\r\n' + output.output[0].code);

   console.log('⚙️\t Script API injected . . .');
}
export async function allowAllModules(): Promise<void> {
   await writeFile(
      resolve(CACHE_DUMP_DIR, './config/default/permissions.json'),
      JSON.stringify({
         allowed_modules: [
            '@minecraft/diagnostics',
            '@minecraft/common',
            '@minecraft/server-net',
            '@minecraft/server',
            '@minecraft/server-ui',
            '@minecraft/server-admin',
            '@minecraft/server-editor',
            '@minecraft/server-gametest',
         ],
      }),
   );
}
export async function prepareManifest(): Promise<void> {
   const filename = resolve(CACHE_DUMP_DIR, './behavior_packs/editor/manifest.json');
   if (!existsSync(filename)) throw new ReferenceError('Corrupted installation or outdated information!!!');

   const data = await readFile(filename);
   const manifest = JSON.parse(data.toString());
   if (manifest.dependencies.find((_: { module_name?: string }) => _.module_name === '@minecraft/server-net')) return;

   manifest.dependencies.push({
      module_name: '@minecraft/server-net',
      version: '1.0.0-beta',
   });

   await writeFile(filename, JSON.stringify(manifest));
}
