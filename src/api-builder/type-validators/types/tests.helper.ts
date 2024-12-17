import { Type } from '../type';
import { DiagnosticsStack } from '../../diagnostics';

export function validateThrow(type: Type, value: unknown) {
   const diagnostics = new DiagnosticsStack();
   type.validate(diagnostics, value);
   if (!diagnostics.isEmpty) return diagnostics.throw();
}
