import { getModuleVersions } from '../api-builder/plugin';

export function getVitestAliases() {
   return Object.fromEntries([...getModuleVersions('path').entries()]);
}
