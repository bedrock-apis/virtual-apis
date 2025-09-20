import { existsSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { build } from 'rolldown';
import { DumpProvider, DumpProviderScriptApi } from './api';
import { CACHE_BDS } from './constants';

export async function setupScriptAPI(providers: DumpProvider[]): Promise<void> {
   const worlds = resolve(CACHE_BDS, './worlds');
   if (existsSync(worlds)) await rm(worlds, { recursive: true, force: true });
   await allowAllModules();

   const editorFile = resolve(CACHE_BDS, './behavior_packs/editor/scripts/Main.js');
   await prepareManifest();

   const providerEntries: string[] = [];
   for (const provider of providers) {
      if (!(provider instanceof DumpProviderScriptApi)) continue;
      if (!existsSync(provider.scriptApiCodePath))
         throw new ReferenceError(`Dump failed, ${provider.id}'s ${provider.scriptApiCodePath} does not exist!`);

      providerEntries.push(provider.scriptApiCodePath.replaceAll('\\', '/'));
   }

   const addonEntry = join(import.meta.dirname, './addon-entry.ts');
   await writeFile(addonEntry, providerEntries.map(e => `import '${e}'`).join('\n'));

   const output = await build({ input: addonEntry, external: [/^@minecraft.+/] });
   await writeFile(editorFile, output.output[0].code);

   console.log('⚙️\tScript API injected . . .');
}

export async function allowAllModules(): Promise<void> {
   await writeFile(
      resolve(CACHE_BDS, './config/default/permissions.json'),
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
   const filename = resolve(CACHE_BDS, './behavior_packs/editor/manifest.json');
   if (!existsSync(filename)) throw new ReferenceError('Corrupted installation or outdated information!!!');

   const data = await readFile(filename);
   const manifest = JSON.parse(data.toString()) as {
      dependencies: { module_name: string; version: string }[];
      capabilities: string[];
   };
   if (manifest.dependencies.find((_: { module_name?: string }) => _.module_name === '@minecraft/server-net')) return;

   manifest.dependencies.push({
      module_name: '@minecraft/server-net',
      version: '1.0.0-beta',
   });

   manifest.dependencies = manifest.dependencies.filter(e => e.module_name !== '@minecraft/server-editor');

   manifest.capabilities = [];

   await writeFile(filename, JSON.stringify(manifest));
}
