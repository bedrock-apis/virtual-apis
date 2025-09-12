import { Context } from '../context/context';
import { InvocationInfo } from '../context/invocation-info';
import { finalizeAsMethod, proxyifyFunction } from '../ecma-utils';
import { API_ERRORS_MESSAGES, CompileTimeError } from '../errorable';
import { IBindableSymbol } from './abstracts/bindable';
import { InvocableSymbol } from './abstracts/invocable';
import { ConstructableSymbol } from './constructable';

const { defineProperty, getOwnPropertyDescriptor } = Reflect;
export class PropertySetterSymbol
   extends InvocableSymbol<(...params: unknown[]) => unknown>
   implements IBindableSymbol
{
   protected override readonly stackTrimEncapsulation: number = 2;
   public constructor() {
      super();
      this.setParamsLength(1);
   }
   public readonly thisType!: ConstructableSymbol;
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const symbol = this;
      function runnable(that: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, [params[0]], that);
         const { diagnostics } = info;

         if (!context.isNativeHandle(that))
            diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound('setter', symbol.identifier));

         symbol.params.isValidValue(diagnostics.errors, info.params);

         //TODO - This case is special it should, return "Failed to set member"
         // Correct implementation is to create new DiagnosticsStackReport and pass it here and manually creating the right base message
         // - BaseError: "Failed to set member"
         //     - SubError: Type mismatch for "this" value
         symbol.thisType.isValidValue(diagnostics.errors, that);

         return symbol.runtimeGetResult(info);
      }
      const executable = proxyifyFunction(runnable);
      finalizeAsMethod(executable, this.paramsLength);

      return executable;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      const descriptor = getOwnPropertyDescriptor(runtime as object, this.name) ?? {
         configurable: true,
         enumerable: false,
      };
      descriptor.set = this.getRuntimeValue(context)!;
      defineProperty(runtime as object, this.name, descriptor);
   }
   public override setIdentifier(identifier: string): this {
      return super.setIdentifier(`${identifier} setter`);
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
   protected override readonly stackTrimEncapsulation: number = 2;
   public constructor() {
      super();
      this.setParamsLength(0);
   }
   public readonly thisType!: ConstructableSymbol;
   public readonly setter?: PropertySetterSymbol;
   public readonly isRuntimeBaked: boolean = false;
   protected override compile(context: Context): (...params: unknown[]) => unknown {
      // oxlint-disable-next-line no-this-alias
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const symbol = this;
      function runnable(that: unknown, ..._: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, [], that);
         const { diagnostics } = info;

         // If Config["Getter Require Valid Handle"] return undefined, without throwing
         if (!context.isNativeHandle(that))
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
      const descriptor = getOwnPropertyDescriptor(runtime as object, this.name) ?? {
         configurable: true,
         enumerable: false,
      };
      descriptor.get = this.getRuntimeValue(context)!;
      defineProperty(runtime as object, this.name, descriptor);
   }
   public override setIdentifier(identifier: string): this {
      return super.setIdentifier(`${identifier} getter`);
   }
   public setThisType(type: ConstructableSymbol): this {
      (this as Mutable<this>).thisType = type;
      return this;
   }
   public setIsRuntimeBaked(isBaked: boolean): this {
      (this as Mutable<this>).isRuntimeBaked = isBaked;
      return this;
   }

   public setSetter(setter: PropertySetterSymbol) {
      (this as Mutable<this>).setter = setter;
      return this;
   }

   public override precompileChecks(_: Context): void {
      super.precompileChecks(_);
      if (!this.thisType) throw new CompileTimeError('thisType is not set, but required for compilation');
   }
}
