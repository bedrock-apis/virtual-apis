import { MetadataFunctionArgumentDefinition, Range } from '../../script-module-metadata';
import { Context } from '../context';
import { ERRORS } from '../errors';
import { DiagnosticsStack } from '../diagnostics';
import { Kernel } from '../kernel';
import { Type } from './type';
import { BaseNumberType } from './types/number';

export class ParamsDefinition extends Kernel.Empty {
   public requiredParams: number = 0;
   public params = Kernel.Construct('Array') as ParamType[];

   /**
     * Special logic for handling ranges as the could be different from defined type, check example below 
            {
              "details": {
                "max_value": 1000.0,
                "min_value": 0.0
              },
              "name": "radius",
              "type": {
                "is_bind_type": false,
                "is_errorable": false,
                "name": "float",
                "valid_range": {
                  "max": 2147483647,
                  "min": -2147483648
                }
              }
            },
     */

   public constructor(context?: Context, params?: MetadataFunctionArgumentDefinition[]) {
      super();
      if (context && params) {
         for (const [i, param] of params.entries()) {
            const type = context.resolveType(param.type);
            const isOptional = typeof param.details?.default_value !== 'undefined';
            const defaultValue = param.details?.default_value === 'null' ? null : param.details?.default_value;
            const validRange =
               param.details && 'max_value' in param.details && 'min_value' in param.details
                  ? { min: param.details.min_value, max: param.details.max_value }
                  : undefined;

            const paramType = new ParamType(type, isOptional, defaultValue, validRange, i);
            this.addType(paramType);
         }
      }
   }

   public addType(type: ParamType): this {
      if (this.params.length === this.requiredParams && !type.isOptional) {
         this.params.push(type);
         this.requiredParams = this.params.length;
      } else if (!type.isOptional) {
         throw Kernel.Construct('TypeError', 'Required parameter cannot be set after optional was defined');
      } else this.params.push(type);

      return this;
   }

   public validate(diagnostics: DiagnosticsStack, params: unknown[]) {
      if (params.length > this.params.length || params.length < this.requiredParams)
         return diagnostics.report(
            ERRORS.IncorrectNumberOfArguments({ min: this.requiredParams, max: this.params.length }, params.length),
         );

      for (const [i, value] of params.entries()) {
         this.params[i]?.validate(diagnostics, value);
      }
   }
}

export class ParamType extends Type {
   public constructor(
      public readonly type: Type,
      public readonly isOptional: boolean,
      public readonly defaultValue: unknown,
      public readonly range: Range<number, number> | undefined,
      public readonly i: number = 0,
   ) {
      super();
   }
   public validate(diagnostics: DiagnosticsStack, value: unknown): void {
      if (this.isOptional) value ??= this.defaultValue;

      const typeDiagnostics = new DiagnosticsStack();
      this.type.validate(typeDiagnostics, value);

      if (typeDiagnostics.isEmpty && this.range) {
         BaseNumberType.ValidateRange(typeDiagnostics, value as number, this.range, this.i);
      }

      // TODO Check whenever it returns something like ERRORS.FunctionArgumentExpectedType
      diagnostics.report(...typeDiagnostics.stack);
   }
}
