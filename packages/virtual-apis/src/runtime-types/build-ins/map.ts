import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType, Type } from '../type';

export class MapType extends Type {
   public constructor(public readonly valueType: RuntimeType) {
      super();
   }
   public override name = 'map';
   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (typeof value !== 'object' || value === null)
         //TODO: isn't 'function' type also allowed?
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;

      // TODO Currently it ignores symbol keys validation, need to check how mc reacts on this
      // TODO getOwnPropertyNames/symbols?
      const mapDiagnostics = new DiagnosticsStackReport();

      // We don't know if thats only ownPropertySymbol or all enumerable
      for (const key in value) {
         //key is enumerable in the first place
         this.valueType.isValidValue(mapDiagnostics, (value as Record<string, unknown>)[key]);
      }

      if (!mapDiagnostics.isEmpty) {
         // TODO Ensure that error is native type conversation failed
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      }
      return true;
   }
}
