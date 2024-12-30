import { getModuleVersions } from '../plugin';

export function getVitestAliases() {
   return Object.fromEntries([...getModuleVersions('path').entries()]);
}
