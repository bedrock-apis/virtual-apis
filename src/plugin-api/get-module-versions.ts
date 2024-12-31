// This function is run only at the startup time, before any user code
/* eslint-disable custom/no-iterators */
/* eslint-disable custom/no-globals */

import fs from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import url from 'node:url';

import { API_MODULES_JSON_FILENAME, MODULES_DIR } from '../constants';

export function getModuleVersions(format: 'url' | 'path' = 'url') {
   // It is required to make node think we are importing all modules from the cwd, because
   // otherwise they will not resolve
   const require = module.createRequire(url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
   const packageJsonPath = path.parse(require.resolve('@bedrock-apis/virtual-apis/package.json')).dir;
   const modulesPath = path.join(packageJsonPath, MODULES_DIR);
   const apiModulesListPath = path.join(modulesPath, API_MODULES_JSON_FILENAME);
   const apiModulesList: Record<string, string[]> = JSON.parse(fs.readFileSync(apiModulesListPath, 'utf-8'));
   const modules: Map<string, string> = new Map();

   for (const [name, versions] of Object.entries(apiModulesList)) {
      try {
         const pathToPackage = require.resolve(name + '/package.json');
         const { version } = JSON.parse(fs.readFileSync(pathToPackage, 'utf-8'));
         if (!versions.includes(version)) {
            console.warn(`${name}: Version ${version} is requested, but only ${versions.join(' ')} are available.`);
         } else {
            const resolved = path.join(modulesPath, name + '@' + version + '.js');
            modules.set(name, format === 'url' ? url.pathToFileURL(resolved).href : resolved);
         }
      } catch (e) {
         if (e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND') continue; // Modules is not installed by user;
         console.error('Failed to load module', name, 'error:', e);
         process.exit(1);
      }
   }

   return modules;
}
