import { VirtualPrivilege } from '@bedrock-apis/va-common';
import { Context } from '../context/context';
import { InvocationInfo } from '../context/invocation-info';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import {
   API_ERRORS_MESSAGES,
   CompileTimeError,
   NativeActionKindShort,
   NativeKind,
   NativeKindShort,
} from '../errorable';
import { IBindableSymbol } from './abstracts/bindable';
import { InvocableSymbol } from './abstracts/invocable';
import type { ConstructableSymbol } from './constructable';

export class MethodSymbol extends InvocableSymbol<(...params: unknown[]) => unknown> implements IBindableSymbol {
   protected override readonly stackTrimEncapsulation: number = 2; // proxied
   public readonly thisType!: ConstructableSymbol;
   public override kindShort: NativeKindShort = 'function';
   public override actionKind: NativeKind = 'function';
   public override kind: NativeActionKindShort = 'call';
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      const symbol = this;
      function runnable(that: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, params, that);
         const { diagnostics } = info;

         if (!context.isNativeHandleInternal(that))
            diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound(symbol.actionKind, symbol.identifier));

         if (
            context.currentPrivilege !== VirtualPrivilege.None &&
            !symbol.privileges.includes(context.currentPrivilege)
         )
            diagnostics.errors.report(API_ERRORS_MESSAGES.NoPrivilege(symbol.actionKind, symbol.identifier));

         symbol.params.isValidValue(diagnostics.errors, info.params);

         return symbol.runtimeInvocationGetResult(info);
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

   public setThisType(type: ConstructableSymbol): this {
      (this as Mutable<this>).thisType = type;
      return this;
   }
   public override precompileChecks(_: Context): void {
      super.precompileChecks(_);
      if (!this.thisType) throw new CompileTimeError('thisType is not set, but required for compilation');
   }
}
