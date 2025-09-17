import { Range } from '@bedrock-apis/va-types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport, ErrorFactory, NumberErrorFactory, Report } from '../../errorable';
import { RuntimeType, Type } from '../type';
import { NumberType } from './number';

export const functionType: RuntimeType = {
   name: 'function',
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (typeof value !== 'function') {
         // TODO Closure: (ButtonPushAfterEvent) => void
         return (diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false);
      }
      return true;
   },
};

export class ClosureType extends Type {
   public override name: string;
   public constructor(types: RuntimeType[]) {
      super();
      const [returnType, ...params] = types;
      this.name = `Closure: (${params.map(e => e.name).join(', ')}) => ${returnType?.name === 'undefined' ? 'void' : returnType?.name}`;
   }
   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      if (typeof value !== 'function') {
         return (diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false);
      }
      return true;
   }
}

export class FunctionArgumentType extends Type {
   public constructor(
      public readonly type: RuntimeType,
      public readonly index: number,
      public readonly range: undefined | Range<number, number>,
      public readonly defaultValue: unknown,
   ) {
      super();
      if (range && type instanceof NumberType) this.detailedType = new NumberType(range);
   }

   public detailedType?: NumberType;

   public get name() {
      return this.type.name + ' (default ' + this.defaultValue + ')';
   }

   public override isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      let result = this.type.isValidValue(diagnostics, value);

      // Detailed type is checked after in mc so that bigger bounds are reported before smaller ones
      if (result && this.detailedType) {
         result = this.detailedType.isValidValue(diagnostics, value);
      }

      for (const report of diagnostics.stack) {
         const error = report instanceof Report ? (report.factory as Mutable<ErrorFactory>) : report.throw();

         if (error instanceof NumberErrorFactory) {
            (error as Mutable<ErrorFactory>).message =
               `Unsupported or out of bounds value passed to function argument [${this.index}]. ${error.text}`;
         } else {
            error.message += ` Function argument [${this.index}] expected type: ${this.type.name}`;
         }
      }

      return result;
   }
}
