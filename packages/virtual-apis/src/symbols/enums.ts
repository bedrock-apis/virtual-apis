import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { RuntimeType } from '../runtime-types';
import { CompilableSymbol } from './abstracts/compilable';

const { fromEntries } = Object;
export class EnumerableAPISymbol extends CompilableSymbol<object> implements RuntimeType {
   public readonly constants = new Map();
   public readonly values = new Set();
   protected override compile(): object {
      return fromEntries(this.constants.entries());
   }
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      const $ = this.values.has(value);
      if (!$)
         // TODO: What Error it should report?
         diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return $;
   }
}
