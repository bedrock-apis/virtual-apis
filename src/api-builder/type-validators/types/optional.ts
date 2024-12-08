import { MetadataType } from '../../../package-builder/script-module-metadata';
import { Diagnostics, ERRORS } from '../../errors';
import { resolveType } from '../resolve';
import { Type } from '../type';

export class OptionalType extends Type {
   public constructor(
      metadata: MetadataType,
      private type = resolveType(metadata),
   ) {
      super();
   }

   public validate(diagnostics: Diagnostics, value: unknown): void {
      if (typeof value === 'undefined' || value === null) return;

      const underDiagnostic = new Diagnostics();
      this.type.validate(underDiagnostic, value);
      if (!underDiagnostic.success)
         diagnostics.report(
            ...underDiagnostic.errors.map(e =>
               ERRORS.NativeTypeConversationFailed === e ? ERRORS.NativeOptionalTypeConversationFailed : e,
            ),
         );
   }
}
