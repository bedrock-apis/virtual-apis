import { ModuleContext } from './context';
import { DiagnosticsStackReport } from './diagnostics';
import { Type } from './type-validators';

export function testCreateModuleContext() {
   return new ModuleContext('uuid', '0.0.0', '@minecraft/server');
}

export function testType(type: Type, value: unknown, trimStack: number = 1) {
   const diagnostics = new DiagnosticsStackReport();
   type.validate(diagnostics, value);
   if (!diagnostics.isEmpty) throw diagnostics.throw();
}
