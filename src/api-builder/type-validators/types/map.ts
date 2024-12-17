import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Kernel } from '../../kernel';
import { Type } from '../type';

export class MapType extends Type {
   public constructor(
      public readonly keyType: Type,
      public readonly valueType: Type,
   ) {
      super();
   }

   public validate(diagnostics: DiagnosticsStack, map: unknown) {
      if (typeof map !== 'object' || map === null) return diagnostics.report(ERRORS.NativeTypeConversationFailed);

      // TODO Currently it ignores symbol keys validation, need to check how mc reacts on this
      // TODO getOwnPropertyNames/symbols?
      const mapDiagnostics = new DiagnosticsStack();
      for (const key of Kernel.Constructor('Object').keys(map)) {
         this.keyType.validate(mapDiagnostics, key);
         this.valueType.validate(mapDiagnostics, (map as Record<string, unknown>)[key]);
      }

      if (!mapDiagnostics.isEmpty) {
         // TODO Ensure that error is native type conversation failed
         diagnostics.report(ERRORS.NativeTypeConversationFailed, ...mapDiagnostics.stack);
      }
   }
}
