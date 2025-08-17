import { Context } from '@bedrock-apis/virtual-apis';
import fs from 'node:fs/promises';
import module from 'node:module';
import path from 'node:path';
import url from 'node:url';
import { BinaryLoaderContext } from './image-loader-instanced';
export class ModuleLoader {
   private async getFromNodeModules(): Promise<Uint8Array<ArrayBufferLike>> {
      try {
         // It is required to make node think we are importing all modules from the cwd, because
         // otherwise they will not resolve
         //console.warn("URL",url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
         const require = module.createRequire(url.pathToFileURL(path.join(process.cwd(), 'hooks.js')).href);
         const installed = require.resolve('@bedrock-apis/va-images');
         return new Uint8Array(await fs.readFile(installed));
      } catch (e) {
         if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) {
            throw new Error('Module @bedrock-apis/va-images not found');
         }
         throw e;
      }
   }

   public constructor(public readonly context: Context) {}

   public async loadModules(versions: Map<string, string>) {
      console.log('loading modules', versions);
      const image = await this.getFromNodeModules();
      const loader = BinaryLoaderContext.create(image);
      const str = loader.preparedImage.stringSlices.fromIndex;

      for (const [name, version] of versions) {
         const mod = loader.preparedImage.modules.find(
            e => str(e.metadata.name) === name && str(e.metadata.version) === version,
         );

         if (!mod) {
            console.warn('not found module', name, version);
            continue;
         }

         loader.getSymbolForPreparedImage(mod);
      }
   }
}
