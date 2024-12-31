import { getModuleVersions } from '../plugin-api';

export function getVitestAliases() {
   return Object.fromEntries([...getModuleVersions('path').entries()]);
}
