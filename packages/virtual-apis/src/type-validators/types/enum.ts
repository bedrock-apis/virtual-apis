import { KernelArray } from '@bedrock-apis/kernel-isolation';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../diagnostics';
import { Type } from '../type';

export class EnumType extends Type {
   public constructor(public readonly constants: [key: string, value: unknown][]) {
      super();
   }
   public validate(diagnostics: DiagnosticsStackReport, object: unknown) {
      for (const constant of KernelArray.From(this.constants).getIterator()) {
         if (constant[1] === object) return diagnostics;
      }

      // TODO: What Error it should report?
      diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return diagnostics;
   }
}
