import { readFile, readdir } from 'node:fs/promises';
import type { RolldownOptions } from 'rolldown';
import { workspaces, devDependencies, dependencies } from '../../package.json' with { type: 'json' };
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const external = [new RegExp(`^(node:|${Object.keys(devDependencies).join('|')}|@bedrock-apis)`)];

export { workspaces, devDependencies, dependencies };
export const options: RolldownOptions[] = [];

for (const workspace of workspaces) {
   const folderName = workspace.replace(/[/*]+$/, '');
   for (const entry of await readdir(folderName, { withFileTypes: true })) {
      const path = `./${folderName}/${entry.name}/`;
      if (existsSync(`${path}/package.json`)) {
         const buffer = await readFile(`${path}/package.json`);
         const { types, main, exports } = JSON.parse(buffer.toString()) as ModulePackageJson;
         if (main && types) {
            const input = resolve(path, types);
            if (existsSync(input))
               options.push({
                  external,
                  input,
                  output: {
                     file: resolve(path, main),
                  },
               });
         }

         if (exports)
            for (const name of Object.keys(exports)) {
               const obj = exports[name];
               if (typeof obj === 'object' && obj.rolldown === true && obj.default && obj.types)
                  options.push({
                     external,
                     input: resolve(path, obj.types),
                     output: {
                        file: resolve(path, obj.default),
                     },
                  });
            }
      }
   }
}
interface ModulePackageJson {
   name: string;
   main?: string;
   types?: string;
   exports?: {
      [k: string]:
         | string
         | {
              rolldown?: boolean;
              default?: string;
              types?: string;
           };
   };
}
