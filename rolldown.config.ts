import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { RolldownOptions } from 'rolldown';
import { devDependencies, workspaces } from './package.json' with { type: 'json' };

const external = [new RegExp(`^(node:|${Object.keys(devDependencies).join('|')}|@bedrock-apis)`)];
const options: RolldownOptions[] = [];

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
               options.push({ external, input, output: { file: resolve(path, main), sourcemap: 'inline' } });
         }

         if (exports) {
            const option = {
               external,
               input: [] as string[],
               output: { dir: path + 'dist/', sourcemap: 'inline' },
            } satisfies RolldownOptions;

            for (const name of Object.keys(exports)) {
               const obj = exports[name];
               if (typeof obj === 'object' && obj.rolldown === null && obj.default && obj.types)
                  option.input.push(resolve(path, obj.types));
            }
            if (option.input.length) options.push(option);
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
export default options;
