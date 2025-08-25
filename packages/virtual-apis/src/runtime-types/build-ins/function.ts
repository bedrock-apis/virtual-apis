import { Range } from '@bedrock-apis/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport, ErrorFactory } from '../../errorable';
import { RuntimeType, Type } from '../type';
import { NumberType } from './number';

export const functionType: RuntimeType = {
   name: 'function',
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (typeof value !== 'function') {
         // TODO Closure: (ButtonPushAfterEvent) => void
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      }
      return true;
   },
};

export class FunctionArgumentType extends Type {
   public constructor(
      public readonly type: RuntimeType,
      public readonly index: number,
      public readonly range: undefined | Range<number, number>,
      public readonly defaultValue: unknown,
   ) {
      if (range && type instanceof NumberType) (type as Mutable<NumberType>).range = range;
      super();
   }

   public get name() {
      return this.type.name;
   }

   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      const result = this.type.isValidValue(diagnostics, value);

      if (this.type instanceof FunctionArgumentType) return result;

      for (const report of diagnostics.stack) {
         const error = report.factory as Mutable<ErrorFactory>;

         // TODO better way to determine error type, maybe property on factory
         if (this.type instanceof NumberType && error.message?.includes('bounds')) {
            error.message = `Unsupported or out of bounds value passed to function argument [${this.index}] ${error.message}`;
         } else {
            error.message += ` Function argument [${this.index}] expected type: ${this.type.name}`;
         }
      }

      return result;
   }
}
