import { Kernel } from '../../virtual-apis';
import { getModuleVersions } from '../apis/get-module-versions';

const MODULES = getModuleVersions();

await Kernel['globalThis::Promise'].all(
   Kernel['globalThis::Array'].from(MODULES.keys()).map(specifier => import(specifier)),
);
