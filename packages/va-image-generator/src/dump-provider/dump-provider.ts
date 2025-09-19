import { DumpProvider } from '@bedrock-apis/va-bds-dumps/api';
import fs from 'node:fs/promises';
import path from 'node:path';
import { SystemFileMetadataProvider } from '../metadata-provider';
import { MetadataToSerializableTransformer } from '../metadata-to-serializable';
import { BinaryImageFormat } from './image-format';

export const modulesProvider = new DumpProvider(
   'modules',
   async (bds, output) => {
      await fs.cp(path.join(bds, 'docs/script_modules'), path.join(output, 'script_metadata'));

      const jsModules = path.join(output, 'js_modules');
      await fs.mkdir(jsModules);
      for (const folder of await fs.readdir(path.join(bds, 'behavior_packs'), { withFileTypes: true })) {
         if (!folder.isDirectory()) continue;

         const name = folder.name.replace(/_library$/, '');
         if (name === folder.name) continue; //not a module

         //libs\va-bds-dumps\dist\cache-bds\behavior_packs\server_editor_library\scripts
         await fs.cp(path.join(folder.parentPath, folder.name, 'scripts'), path.join(jsModules, name), {
            recursive: true,
         });
      }
   },
   async output => {
      return new MetadataToSerializableTransformer().transform(
         new SystemFileMetadataProvider(path.join(output, 'script_metadata'), path.join(output, 'js_modules')),
      );
   },
   new BinaryImageFormat(),
);
