// import { ModuleContext } from '../../../legacy-store/context';
import { DiagnosticsStackReport } from './errorable';
import { Type } from './runtime-types';
// import { Type } from '../../../legacy-store/type-validators';

// export function testCreateModuleContext() {
//    return new ModuleContext('uuid', '0.0.0', '@minecraft/server');
// }

export function testType(type: Type, value: unknown, trimStack: number = 1) {
   const diagnostics = new DiagnosticsStackReport();
   type.isValidValue(diagnostics, value);
   if (!diagnostics.isEmpty) throw diagnostics.throw();
}
