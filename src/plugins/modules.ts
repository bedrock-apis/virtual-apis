import { getModuleVersions } from '../api-builder/plugin/get-module-versions';

const MODULES = getModuleVersions();

await Promise.all([...MODULES.keys()].map(specifier => import(specifier)));
