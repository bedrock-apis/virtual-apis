import { createPackageCode } from './create-package-code';
import { getModuleVersions } from './get-module-versions';

export function virtualApi(): import('vitest/node').Vite.Plugin {
   const versions = getModuleVersions();

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
            return createPackageCode(id, version);
         }
         return null;
      },
   };
}
