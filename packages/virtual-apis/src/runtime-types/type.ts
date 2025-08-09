import { Kernel } from '@bedrock-apis/kernel-isolation';
import type { DiagnosticsStackReport } from '../diagnostics';
export interface RuntimeType {
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean;
}

export abstract class Type extends Kernel.Empty implements RuntimeType {
   // Diagnostics are always passed by someone who requested this type check
   public abstract isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean;
}
