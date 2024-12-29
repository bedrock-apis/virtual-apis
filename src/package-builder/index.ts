import { existsSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { f, fit, Formats, use } from './console-formatting';
import { IMetadataProvider, SystemFileMetadataProvider } from './metadata-provider';
import { printModule } from './printer';
//import { generateModule } from './codegen';

const OUT_DIR = 'packages';
const API_FILENAME = 'api.js';
const API_BUILDER_FILENAME = resolve(import.meta.dirname, './api-builder.js');

main(new SystemFileMetadataProvider('./local-docs/')).then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);

async function main(provider: IMetadataProvider): Promise<number> {
   console.log(f`====================================`(Formats.Italic, Formats.LightBlue));
   console.log(f`== Virtual API Packages Generator ==`(Formats.Italic, Formats.LightBlue));
   console.log(f`====================================\n`(Formats.Italic, Formats.LightBlue));
   // Static Move Copy
   if (!existsSync(OUT_DIR)) {
      await mkdir(OUT_DIR);
      console.log('Created ' + OUT_DIR);
   }

   if (!existsSync(resolve(OUT_DIR, './@minecraft'))) {
      await mkdir(resolve(OUT_DIR, './@minecraft'));
      console.log('Created ' + OUT_DIR + './@minecraft');
   }

   if (!existsSync(API_BUILDER_FILENAME)) {
      console.log(`Failed to find API builder code file: ` + API_BUILDER_FILENAME);
      return -1;
   }

   const successes = await copyFile(API_BUILDER_FILENAME, resolve(OUT_DIR, API_FILENAME)).then(
      () => true,
      () => false,
   );

   if (!successes) {
      console.error('Failed to copy api builder file to the package destination: ' + API_BUILDER_FILENAME);
      return -1;
   }

   console.log(f` <CLONE> from ${API_BUILDER_FILENAME} to ${OUT_DIR + '/' + API_FILENAME}\n`(Formats.Dark));

   for await (const data of provider.getMetadataModules()) {
      const time = Date.now();
      const { definitionsCode, exportsCode } = await printModule(data);
      const name = data.name;
      await writeFile(resolve(OUT_DIR, name + '.native.js'), definitionsCode);
      reportGenerated(name.slice(11) + '.native.js', definitionsCode.length);
      await writeFile(resolve(OUT_DIR, name + '.js'), exportsCode);
      reportGenerated(name.slice(11) + '.js', exportsCode.length);
      console.log(`\n${use('✔', Formats.LightGreen)} Finished in ${Date.now() - time}ms`);
   }
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
