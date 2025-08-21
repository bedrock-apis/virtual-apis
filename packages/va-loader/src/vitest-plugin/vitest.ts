import { BinaryLoaderContext } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { createCodeURL } from '../create-code-url';
import { getImageFromNodeModules, getModuleVersions } from '../get-module-versions';

export async function virtualApi(): Promise<import('vitest/node').Vite.Plugin> {
   const versions = getModuleVersions();
   const loader = BinaryLoaderContext.create(await getImageFromNodeModules());
   const context = new Context();
   await loader.loadModules(versions, context);

   const virtualPrefix = '/@virtual:bedrock-apis-virtual-apis/';
   return {
      name: 'bedrock-apis-virtual-apis',
      enforce: 'pre',
      resolveId(id) {
         if (versions.has(id)) return virtualPrefix + id;
         return null;
      },
      load(id) {
         if (id.startsWith(virtualPrefix)) {
            id = id.slice(virtualPrefix.length);
            const version = versions.get(id);
            if (!version) throw new Error('No version found for module ' + id);
            const module = loader.loadedModuleSymbols.get(id);
            return createCodeURL(module?.getRuntimeValue(context) ?? {}, id, 0);
         }
         return null;
      },
   };
}
