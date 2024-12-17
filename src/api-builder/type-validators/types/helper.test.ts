import { Type } from '../type';
import { DiagnosticsStack } from '../../diagnostics';

export function ValidateThrow(type: Type, value: unknown) {
   const diagnostics = new DiagnosticsStack();
   type.validate(diagnostics, value);
   if (diagnostics.length !== 0) return diagnostics.throw();
}
