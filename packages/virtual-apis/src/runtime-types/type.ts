import type { DiagnosticsStackReport } from '../errorable';
export interface RuntimeType {
   name: string;
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean;
}

export abstract class Type implements RuntimeType {
   // Diagnostics are always passed by someone who requested this type check
   public abstract isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean;

   public abstract name: string;
}
