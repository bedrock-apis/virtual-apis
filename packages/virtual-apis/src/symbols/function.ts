import { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import { IBindableSymbol } from './bindable';
import { InvocableSymbol } from './invocable';

export class FunctionSymbol extends InvocableSymbol<(...params: unknown[]) => unknown> implements IBindableSymbol {
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const symbol = this;
      function runnable(this: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, params);
         info.setThisObject(this);
         const { diagnostics } = info;
         symbol.params.isValidValue(diagnostics.errors, info.params);
         return symbol.runtimeGetResult(info);
      }
      const executable = proxyifyFunction(runnable);
      finalizeAsMethod(executable, this.paramsLength);
      // We don't want to compile its value

      return executable;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      Reflect.defineProperty(runtime as object, this.name, {
         configurable: true,
         enumerable: true,
         writable: true,
         value: this.getRuntimeValue(context),
      });
   }
}
