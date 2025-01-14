import chalk from 'chalk';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { API_JS_FILENAME, API_MODULES_JSON_FILENAME, MODULES_DIR } from '../../utils/constants';
import { IMetadataProvider, SystemFileMetadataProvider } from './metadata-provider';
import { printModule } from './printer';
import { metadataModuleFullname } from './virtual-apis/helper';

const API_BUILDER_FILENAME = path.join(import.meta.dirname, './index.js');
const API_JS_PATH = path.join(MODULES_DIR, API_JS_FILENAME);

main(new SystemFileMetadataProvider('./local-docs/')).then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);

async function main(provider: IMetadataProvider): Promise<number> {
   const start = Date.now();
   if (process.env.GITHUB_ACTION) chalk.level = 3;
   console.log(chalk.italic.blueBright`====================================`);
   console.log(chalk.italic.blueBright`== Virtual API Modules Generator ==`);
   console.log(chalk.italic.blueBright`====================================\n`);

   if (!existsSync(API_BUILDER_FILENAME)) {
      console.log(`Failed to find API builder code file: ` + API_BUILDER_FILENAME);
      return -1;
   }

   await fs.rm(MODULES_DIR, { recursive: true, force: true });

   // Static Move Copy
   await fs.mkdir(MODULES_DIR);
   await fs.mkdir(path.join(MODULES_DIR, './@minecraft'));

   const apiJsWriteStatus = await fs.writeFile(API_JS_PATH, 'export * from "../dist/index.js"').then(
      () => true,
      () => false,
   );

   if (!apiJsWriteStatus) {
      console.error('Failed to write api builder reexport file to the package destination: ' + API_BUILDER_FILENAME);
      return -1;
   } else console.log(`${chalk.gray`<WRITE>`} ${API_JS_PATH}\n`);

   const modules = new Map<string, string[]>();

   for await (const data of provider.getMetadataModules()) {
      // const time = Date.now();
      const { definitionsCode, exportsCode } = await printModule(data);
      const name = metadataModuleFullname(data);
      await fs.writeFile(path.join(MODULES_DIR, name + '.native.js'), definitionsCode);
      reportGenerated(name.slice(11) + '.native.js', definitionsCode.length);
      await fs.writeFile(path.join(MODULES_DIR, name + '.js'), exportsCode);
      reportGenerated(name.slice(11) + '.js', exportsCode.length);

      let versions = modules.get(data.name);
      if (!versions) {
         versions = [];
         modules.set(data.name, versions);
      }
      versions.push(data.version);
      // console.log(`\n${use('✔', Formats.LightGreen)} Finished in ${Date.now() - time}ms`);
   }

   const totalVersions = [...modules.values()].reduce((p, c) => p + c.length, 0);
   await fs.writeFile(
      path.join(MODULES_DIR, API_MODULES_JSON_FILENAME),
      JSON.stringify(Object.fromEntries([...modules.entries()]), null, 2),
   );

   console.log(
      `\n${chalk.greenBright('✔')} Finished writing ${chalk.bold(modules.size)} modules with ${totalVersions} versions are generated in ${chalk.bold(Date.now() - start)}ms`,
   );

   // 0 is success
   return 0;
}
function reportGenerated(file: string, size: number) {
   console.log(`${chalk.gray`<GEN> /`}${fit(chalk.cyan(file), 50)} ${chalk.gray(`file │ size: ${(size / 1000).toFixed(1)}kB`)}`);
}

function fit(data: string, size: number) {
   if (data.length < size) return data + ' '.repeat(size - data.length);
   return data;
}
