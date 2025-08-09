import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import { IBindableSymbol } from './bindable';
import { InvocableSymbol } from './invocable';

export class FunctionSymbol extends InvocableSymbol<(...params: unknown[]) => unknown> implements IBindableSymbol {
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // oxlint-disable-next-line no-this-alias
      const symbol = this;
      function runnable(this: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, KernelArray.From(params));
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
      Kernel.__defineProperty(runtime, this.name, {
         configurable: true,
         enumerable: true,
         writable: true,
         value: this.getRuntimeValue(context),
      });
   }
}
