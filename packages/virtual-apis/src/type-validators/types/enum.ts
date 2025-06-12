import { KernelArray } from '@bedrock-apis/kernel-isolation';
import { MetadataEnumDefinition } from '@bedrock-apis/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../diagnostics';
import { Type } from '../type';

export class EnumType extends Type {
   public constructor(public readonly definition: MetadataEnumDefinition) {
      super();
   }
   public validate(diagnostics: DiagnosticsStackReport, object: unknown) {
      for (const { value } of KernelArray.From(this.definition.constants).getIterator()) {
         if (value === object) return diagnostics;
      }

      // TODO: What Error it should report?
      diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return diagnostics;
   }
}
