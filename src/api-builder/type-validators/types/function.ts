import { isGeneratorObject } from 'node:util/types';
import { DiagnosticsStackReport, NativeConversionFailedErrorFactory } from '../../diagnostics';
import { Type } from '../type';

export class FunctionType extends Type {
   public override validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      // TODO: No error message
      if (typeof value !== 'function')
         // TODO: Is it really native type conversion error?
         diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}

export class GeneratorType extends Type {
   public validate(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (!isGeneratorObject(value)) diagnostics.report(new NativeConversionFailedErrorFactory('type'));
      return diagnostics;
   }
}
