import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { API_JS_FILENAME, API_MODULES_JSON_FILENAME, MODULES_DIR } from '../constants';
import { f, fit, Formats, use } from './console-formatting';
import { IMetadataProvider, SystemFileMetadataProvider } from './metadata-provider';
import { printModule } from './printer';
import { metadataModuleFullname } from './virtual-apis/helper';

const API_BUILDER_FILENAME = path.join(import.meta.dirname, './index.js');

main(new SystemFileMetadataProvider('./local-docs/')).then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);

async function main(provider: IMetadataProvider): Promise<number> {
   const start = Date.now();
   console.log(f`====================================`(Formats.Italic, Formats.LightBlue));
   console.log(f`== Virtual API Modules Generator ==`(Formats.Italic, Formats.LightBlue));
   console.log(f`====================================\n`(Formats.Italic, Formats.LightBlue));

   await rm(MODULES_DIR, { recursive: true, force: true });

   // Static Move Copy
   if (!existsSync(MODULES_DIR)) {
      await mkdir(MODULES_DIR);
      console.log('Created ' + MODULES_DIR);
   }

   if (!existsSync(path.join(MODULES_DIR, './@minecraft'))) {
      await mkdir(path.join(MODULES_DIR, './@minecraft'));
      console.log('Created ' + MODULES_DIR + './@minecraft');
   }

   if (!existsSync(API_BUILDER_FILENAME)) {
      console.log(`Failed to find API builder code file: ` + API_BUILDER_FILENAME);
      return -1;
   }

   const successes = await writeFile(path.join(MODULES_DIR, API_JS_FILENAME), 'export * from "../dist/index.js"').then(
      () => true,
      () => false,
   );

   if (!successes) {
      console.error('Failed to write api builder reexport file to the package destination: ' + API_BUILDER_FILENAME);
      return -1;
   }

   console.log(f` <WRITE> ${MODULES_DIR + '/' + API_JS_FILENAME}\n`(Formats.Dark));

   const modules = new Map<string, string[]>();

   for await (const data of provider.getMetadataModules()) {
      const time = Date.now();
      const { definitionsCode, exportsCode } = await printModule(data);
      const name = metadataModuleFullname(data);
      await writeFile(path.join(MODULES_DIR, name + '.native.js'), definitionsCode);
      reportGenerated(name.slice(11) + '.native.js', definitionsCode.length);
      await writeFile(path.join(MODULES_DIR, name + '.js'), exportsCode);
      reportGenerated(name.slice(11) + '.js', exportsCode.length);

      let versions = modules.get(data.name);
      if (!versions) {
         versions = [];
         modules.set(data.name, versions);
      }
      versions.push(data.version);

      console.log(`\n${use('✔', Formats.LightGreen)} Finished in ${Date.now() - time}ms`);
   }

   const totalVersions = [...modules.values()].reduce((p, c) => p + c.length, 0);
   await writeFile(
      path.join(MODULES_DIR, API_MODULES_JSON_FILENAME),
      JSON.stringify(Object.fromEntries([...modules.entries()]), null, 2),
   );

   console.log(
      `\n${use('✔', Formats.LightGreen)} ${modules.size} modules with ${totalVersions} versions are generated in ${Date.now() - start}ms`,
   );

   // 0 is success
   return 0;
}
function reportGenerated(file: string, size: number) {
   console.log(
      f` <GEN>/${'\x1b[0m' + fit(use(file, Formats.Cyan), 50)} file | size: ${(size / 1000).toFixed(1)}kB`(
         Formats.Dark,
      ),
   );
}
