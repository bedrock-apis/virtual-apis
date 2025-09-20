import { existsSync } from 'node:fs';
import { glob, readdir, readFile, rm } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import type { RolldownOptions } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { devDependencies } from './package.json' with { type: 'json' };

const folder = 'packages';

const external = [new RegExp(`^(node:|chalk|adm-zip|unzip-web-stream|${Object.keys(devDependencies).join('|')}|@)`)];
const options: RolldownOptions[] = [];
const plugins: RolldownOptions['plugins'] = process.env.PUBLISH ? [dts()] : [];

for (const entry of await readdir(folder, { withFileTypes: true })) {
   const packagePath = `./${folder}/${entry.name}`;
   const packageJsonPath = `${packagePath}/package.json`;

   if (!existsSync(packageJsonPath)) continue;

   const dist = `${packagePath}/dist/`;
   const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8')) as ModulePackageJson;

   if (packageJson.main && packageJson.types) {
      const input = resolve(packagePath, packageJson.types);
      if (existsSync(input)) {
         options.push({
            external,
            plugins,
            input,
            output: { dir: dist, sourcemap: 'inline' },
         });
      }
   }

   if (packageJson.exports) {
      if (packageJson.main || packageJson.types) console.warn('Mixed exports & main fields in', packageJsonPath);

      const option = {
         external,
         plugins,
         input: [] as string[],
         output: { dir: dist, sourcemap: 'inline' },
      } satisfies RolldownOptions;

      for (const name of Object.keys(packageJson.exports)) {
         const obj = packageJson.exports[name];
         if (typeof obj === 'object' && obj.rolldown === null && obj.default && obj.types) {
            const expected = `./dist/${path.parse(obj.types).name}.js`;
            if (expected !== obj.default) {
               console.warn(
                  `${packagePath}/package.json: ${obj.default} must be ${expected}. Custom .js file names are not supported`,
               );
            }

            option.input.push(resolve(packagePath, obj.types));
         }
      }
      if (option.input.length) {
         options.push(option);
         for await (const file of glob(dist + '*.js')) await rm(file, { force: true, recursive: true });
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
