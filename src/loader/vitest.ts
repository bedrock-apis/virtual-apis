import { getModuleVersions } from '../plugin/apis';

export function getVitestAliases() {
   return Object.fromEntries(getModuleVersions('path').entries());
}
