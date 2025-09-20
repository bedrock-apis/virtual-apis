import { DumpProvider } from '@bedrock-apis/va-bds-dumps/api';
import { BinaryImageFormat } from './image-format';

export const modulesProvider = new DumpProvider(
   'modules',
   async (bds, output) => {
      // Save bds run results into the output directory to zip
      const { join } = await import('node:path');
      const { cp, mkdir, readdir } = await import('node:fs/promises');

      await cp(join(bds, 'docs/script_modules'), join(output, 'script_metadata'));

      const jsModules = join(output, 'js_modules');
      await mkdir(jsModules);

      for (const folder of await readdir(join(bds, 'behavior_packs'), { withFileTypes: true })) {
         if (!folder.isDirectory()) continue;

         //libs\va-bds-dumps\dist\cache-bds\behavior_packs\server_editor_library\scripts
         const name = folder.name.replace(/_library$/, '');
         if (name === folder.name) continue; //not a module

         await cp(join(folder.parentPath, folder.name, 'scripts'), join(jsModules, name), {
            recursive: true,
         });
      }
   },
   async output => {
      // Use results from output directory to create an image
      const { MetadataToSerializableTransformer } = await import('./metadata-to-serializable');
      const { SystemFileMetadataProvider } = await import('./metadata-provider');
      const { join } = await import('node:path');

      const transformer = new MetadataToSerializableTransformer();
      const source = new SystemFileMetadataProvider(join(output, 'script_metadata'), join(output, 'js_modules'));

      return transformer.transform(source);
   },
   new BinaryImageFormat(),
);
