// This function is run only at the startup time, before any user code

import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import module from 'node:module';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

function readJsonFileSafely(pathToFile: string) {
   try {
      return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
   } catch {
      return;
   }
}

export function getModuleVersions(cwd = process.cwd()) {
   const modules: Map<string, string> = new Map();

   const packageJson = readJsonFileSafely(path.join(cwd, 'package.json')) as typeof import('../../../package.json');

   if (packageJson) {
      const deps = { ...packageJson.devDependencies, ...packageJson.dependencies };
      // It is required to make node think we are importing all modules from the cwd, because
      // otherwise they will not resolve
      //console.warn("URL",url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
      const require = module.createRequire(url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);

      for (const [depName] of Object.entries(deps)) {
         if (!depName.startsWith('@minecraft')) continue;

         try {
            const pathToPackage = require.resolve(depName + '/package.json');
            let { version } = JSON.parse(fs.readFileSync(pathToPackage, 'utf-8')) as { version: string };
            version = version.replace(/\.\d+\.\d+\.\d+-(stable|preview).*/, '');
            console.log(depName, version);
            modules.set(depName, version);
         } catch (e) {
            console.error('[virtual-api][get-module-versions] Unable to resolve', depName, e);
         }
      }

      return modules;
   }

   const manifestJson = readJsonFileSafely(path.join(cwd, 'manifest.json')) as {
      dependencies: {
         // "@minecraft/server",
         module_name: string;
         // "2.0.0-beta"
         version: string;
      }[];
   };

   if (manifestJson) {
      for (const { module_name, version } of manifestJson.dependencies) {
         modules.set(module_name, version);
      }

      return modules;
   }

   throw new Error(
      `Unable to resolve module versions from cwd ${cwd}, package.json: ${!!packageJson}, manifest.json: ${!!manifestJson}`,
   );
}

export async function getImageFromNodeModules(): Promise<Uint8Array<ArrayBufferLike>> {
   try {
      // It is required to make node think we are importing all modules from the cwd, because
      // otherwise they will not resolve
      //console.warn("URL",url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
      //const require = module.createRequire(url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
      //const installed = require.resolve('@bedrock-apis/va-images/binary-data');
      return new Uint8Array(await readFile(new URL(import.meta.resolve('@bedrock-apis/va-images/binary-data'))));
   } catch (e) {
      if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) {
         throw new Error('Module @bedrock-apis/va-images not found');
      }
      throw e;
   }
}
