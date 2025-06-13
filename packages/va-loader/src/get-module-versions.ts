// This function is run only at the startup time, before any user code

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

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
      for (const [depName, depVersion] of Object.entries(deps)) {
         console.log(depName, depVersion);
         if (!depName.startsWith('@minecraft')) continue;

         modules.set(depName, depVersion);
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
