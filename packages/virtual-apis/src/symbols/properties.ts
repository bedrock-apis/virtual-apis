import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { API_ERRORS_MESSAGES, CompileTimeError } from '../diagnostics';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import { IBindableSymbol } from './bindable';
import { ConstructableSymbol } from './constructable';
import { InvocableSymbol } from './invocable';

export class PropertySetterSymbol
   extends InvocableSymbol<(...params: unknown[]) => unknown>
   implements IBindableSymbol
{
   public readonly thisType!: ConstructableSymbol;
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // oxlint-disable-next-line no-this-alias
      const symbol = this;
      function runnable(this: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, KernelArray.Construct(params[0]));
         info.setThisObject(this);
         const { diagnostics } = info;

         if (context.isNativeHandle(this))
            diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('setter', symbol.identifier));

         symbol.params.isValidValue(diagnostics.errors, info.params);

         //TODO - This case is special it should, return "Failed to set member"
         // Correct implementation is to create new DiagnosticsStackReport and pass it here and manually creating the right base message
         // - BaseError: "Failed to set member"
         //     - SubError: Type mismatch for "this" value
         symbol.thisType.isValidValue(diagnostics.errors, this);

         return symbol.runtimeGetResult(info);
      }
      const executable = proxyifyFunction(runnable);
      finalizeAsMethod(executable, this.paramsLength);

      return executable;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      const descriptor = Kernel.__getProperty(runtime, this.name) ?? {
         configurable: true,
         enumerable: false,
         writable: true,
      };
      descriptor.set = this.getRuntimeValue(context);
      Kernel.__defineProperty(runtime, this.name, descriptor);
   }
   public override setIdentifier(identifier: string): this {
      return super.setIdentifier(`${this.thisType.identifier}::${identifier} setter`);
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

export class PropertyGetterSymbol
   extends InvocableSymbol<(...params: unknown[]) => unknown>
   implements IBindableSymbol
{
   public readonly thisType!: ConstructableSymbol;
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // oxlint-disable-next-line no-this-alias
      const symbol = this;
      function runnable(this: unknown, ..._: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, KernelArray.Construct());
         info.setThisObject(this);
         const { diagnostics } = info;

         // If Config["Getter Require Valid Handle"] return undefined, without throwing
         if (context.isNativeHandle(this))
            diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('getter', symbol.identifier));

         //This check can be omitted as always results as successful
         //symbol.params.isValidValue(diagnostics.errors, info.params);

         return symbol.runtimeGetResult(info);
      }
      const executable = proxyifyFunction(runnable);
      finalizeAsMethod(executable, this.paramsLength);

      return executable;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      const descriptor = Kernel.__getProperty(runtime, this.name) ?? {
         configurable: true,
         enumerable: false,
         writable: true,
      };
      descriptor.get = this.getRuntimeValue(context);
      Kernel.__defineProperty(runtime, this.name, descriptor);
   }
   public override setIdentifier(identifier: string): this {
      return super.setIdentifier(`${this.thisType.identifier}::${identifier} getter`);
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
