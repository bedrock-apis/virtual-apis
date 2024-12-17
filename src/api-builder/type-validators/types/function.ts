import { isGeneratorObject } from 'node:util/types';
import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Kernel } from '../../kernel';
import { Type } from '../type';

export class FunctionType extends Type {
   public override validate(diagnostics: DiagnosticsStack, value: unknown): void {
      // TODO: No error message
      if (typeof value !== 'function')
         diagnostics.report('CHECK TODOS, No implementation error', Kernel['Error::constructor']);
   }
}

export class GeneratorType extends Type {
   public validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (!isGeneratorObject(value)) diagnostics.report(ERRORS.NativeTypeConversationFailed);
   }
}
