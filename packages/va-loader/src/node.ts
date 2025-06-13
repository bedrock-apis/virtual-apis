import Module, { registerHooks } from 'node:module';
import { createPackageCode } from './create-package-code';
import { getModuleVersions } from './get-module-versions';

const modules = getModuleVersions();
const moduleCache = new Map<string, Module.ResolveFnOutput>();

registerHooks({
   resolve(specifier, context, nextResolve) {
      const version = modules.get(specifier);
      if (!version) return nextResolve(specifier, context);

      const id = specifier + ' ' + version;
      let module = moduleCache.get(id);
      if (!module) {
         module = {
            url: `data:application/javascript;base64,${btoa(createPackageCode(specifier, version))}`,
            shortCircuit: true,
         };
         moduleCache.set(id, module);
      }
      return module;
   },
});
