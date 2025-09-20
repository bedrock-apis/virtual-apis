import { corePluginVanillaDataProvider } from '@bedrock-apis/va-core-plugin/dump/provider';
import { BinaryImageLoader } from '@bedrock-apis/va-image-generator';
import { modulesProvider } from '@bedrock-apis/va-image-generator/dump/provider';
import { Context } from '@bedrock-apis/virtual-apis';
import { createCodeURL } from '../create-code-url';
import { getModuleVersions } from '../get-module-versions';

export const context = new Context();

/** @internal */
export async function internalVirtualApiLoad(imagesFolder?: string, loadProviders = false) {
   const versions = getModuleVersions();
   await BinaryImageLoader.loadFrom(await modulesProvider.read(imagesFolder)).loadModules(versions, context);

   if (loadProviders) {
      for (const provider of [corePluginVanillaDataProvider]) {
         await provider.read(imagesFolder);
      }
   }

   return { versions, context };
}

export async function virtualApi(vaImages?: string): Promise<import('vitest/node').Vite.Plugin> {
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
      await internalVirtualApiLoad("${vaImages}", true)
      globalThis.VIRTUAL_APIS_VITEST_CONTEXT = true
   }
   
   `,
            ).code;
         }
         return null;
      },
   };
}
