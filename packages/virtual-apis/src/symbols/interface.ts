import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../errorable';
import { Context } from '../main';
import { RuntimeType } from '../runtime-types';
import { CompilableSymbol } from './general';

const { get } = Reflect;
export class InterfaceSymbol extends CompilableSymbol<null> implements RuntimeType {
   public readonly properties: Map<string, RuntimeType> = new Map();
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      //TODO - What about functions they are half way object right?
      if (typeof value !== 'object' || value === null)
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;

      const interfaceDiagnostics = new DiagnosticsStackReport();
      for (const key of this.properties.keys()) {
         const valueType = this.properties.get(key)!;
         const v = get(value, key);
         valueType.isValidValue(interfaceDiagnostics, v);
      }

      if (!interfaceDiagnostics.isEmpty) {
         // TODO Ensure that error is native type conversation failed
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'), interfaceDiagnostics), false;
      }
      return true;
   }
   protected override compile(context: Context): null {
      return null;
   }
}
