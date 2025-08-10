import { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import { API_ERRORS_MESSAGES, CompileTimeError } from '../errorable';
import { IBindableSymbol } from './bindable';
import type { ConstructableSymbol } from './constructable';
import { InvocableSymbol } from './invocable';

export class MethodSymbol extends InvocableSymbol<(...params: unknown[]) => unknown> implements IBindableSymbol {
   public readonly thisType!: ConstructableSymbol;
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const symbol = this;
      function runnable(this: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, params);
         info.setThisObject(this);
         const { diagnostics } = info;

         if (context.isNativeHandle(this))
            diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('function', symbol.identifier));

         symbol.params.isValidValue(diagnostics.errors, info.params);

         return symbol.runtimeGetResult(info);
      }
      const executable = proxyifyFunction(runnable);
      finalizeAsMethod(executable, this.paramsLength);

      return executable;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      Reflect.defineProperty(runtime as object, this.name, {
         configurable: true,
         enumerable: false, // methods are not enumerable
         writable: true,
         value: this.getRuntimeValue(context),
      });
   }
   public override setIdentifier(identifier: string): this {
      return super.setIdentifier(`${this.thisType.identifier}::${identifier}`);
   }

   public setThisType(type: ConstructableSymbol): this {
      (this as Mutable<this>).thisType = type;
      return this;
   }
   public override precompileChecks(_: Context): void {
      super.precompileChecks(_);
      if (!this.thisType) throw new CompileTimeError('thisType is not set, but required for compilation');
   }
}
