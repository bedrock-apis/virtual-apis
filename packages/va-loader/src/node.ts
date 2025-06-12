import { createRequire, registerHooks } from 'node:module';
import url from 'node:url';
import { createPackageCode } from './create-package-code';
import { getModuleVersions } from './get-module-versions';

const modules = getModuleVersions();
const require = createRequire(import.meta.url);
const virtualApis = url.pathToFileURL(require.resolve('@bedrock-apis/virtual-apis')).href;

registerHooks({
   resolve(specifier, context, nextResolve) {
      const version = modules.get(specifier);
      if (!version) return nextResolve(specifier, context);

      return {
         url: `data:application/javascript;base64,${btoa(createPackageCode(specifier, version, virtualApis))}`,
         shortCircuit: true,
      };
   },
});
