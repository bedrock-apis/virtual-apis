import { Kernel } from '../api-builder';
import { getModuleVersions } from '../plugin-api/get-module-versions';

const MODULES = getModuleVersions();

await Kernel['globalThis::Promise'].all(
   Kernel['globalThis::Array'].from(MODULES.keys()).map(specifier => import(specifier)),
);
