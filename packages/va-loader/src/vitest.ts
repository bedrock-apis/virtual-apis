import { getModuleVersions } from './get-module-versions';

export function getVitestAliases() {
   return Object.fromEntries(getModuleVersions('path').entries());
}
