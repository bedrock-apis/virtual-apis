import { BinaryImageLoader } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { createCodeURL } from '../create-code-url';
import { getModuleVersions, readImageFromNodeModules } from '../get-module-versions';

export const context = new Context();

/** @internal */
export async function internalVirtualApiLoad(imagePath?: string) {
   const versions = getModuleVersions();
   await BinaryImageLoader.loadFromBuffer(await readImageFromNodeModules(imagePath)).loadModules(versions, context);

   return { versions, context };
}

export async function virtualApi(): Promise<import('vitest/node').Vite.Plugin> {
   const vaImages = import.meta.resolve('@bedrock-apis/va-images');
   const { context } = await internalVirtualApiLoad(vaImages);

   const virtualPrefix = '/@virtual:bedrock-apis-virtual-apis/';
   return {
      name: 'bedrock-apis-virtual-apis',
      enforce: 'pre',
      resolveId(id) {
         if (id.startsWith('@minecraft')) return virtualPrefix + id;
         return null;
      },
      load(id) {
         if (id.startsWith(virtualPrefix)) {
            id = id.slice(virtualPrefix.length);

            // Binding link
            const jsModule = context.jsModules.get(id);
            if (jsModule) return jsModule;

            return createCodeURL(
               context.onModuleRequested(id).getRuntimeValue(context),
               id,
               0,
               undefined,
               `
   import { internalVirtualApiLoad } from '@bedrock-apis/va-loader/vitest';
   if (!globalThis.VIRTUAL_APIS_VITEST_CONTEXT) {
      await internalVirtualApiLoad("${vaImages}")
      globalThis.VIRTUAL_APIS_VITEST_CONTEXT = true
   }
   
   `,
            ).code;
         }
         return null;
      },
   };
}
