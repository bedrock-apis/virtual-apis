import { Diagnostics, ERRORS } from '../../errors';
import { Kernel } from '../../kernel';
import { Type } from '../type';

export class MapType extends Type {
   public constructor(
      public readonly keyType: Type,
      public readonly valueType: Type,
   ) {
      super();
   }

   public validate(diagnostics: Diagnostics, map: unknown) {
      if (typeof map !== 'object' || map === null) return diagnostics.report(ERRORS.NativeTypeConversationFailed);

      // TODO Currently it ignores symbol keys validation, need to check how mc reacts on this
      // TODO getOwnPropertyNames/symbols?
      for (const key of Kernel.Constructor('Object').keys(map)) {
         this.keyType.validate(diagnostics, key);
         this.valueType.validate(diagnostics, (map as Record<string, unknown>)[key]);
      }
   }
}
