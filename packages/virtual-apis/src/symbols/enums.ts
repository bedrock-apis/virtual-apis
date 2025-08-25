import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { RuntimeType } from '../runtime-types';
import { CompilableSymbol } from './abstracts/compilable';

const { fromEntries } = Object;
export class EnumerableAPISymbol extends CompilableSymbol<object> implements RuntimeType {
   public constants = new Map();
   public values = new Set();
   public addEntry(key: string, value: unknown) {
      this.constants.set(key, value);
      this.values.add(value);
   }
   protected override compile(): object {
      return fromEntries(this.constants.entries());
   }
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      const $ = this.values.has(value);
      if (!$) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return $;
   }
}
