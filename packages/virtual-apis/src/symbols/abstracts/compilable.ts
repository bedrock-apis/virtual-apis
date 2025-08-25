import type { Context } from '../../context/base';

export abstract class CompilableSymbol<T> {
   // Do not expose this property yet, maybe it will be an map of (Context -> ApiValue)
   // Null means this symbol has no runtime representation after compilation, eg. interfaces
   private readonly RUNTIME: WeakMap<Context, T> = new WeakMap();
   public readonly name!: string;
   protected abstract compile(context: Context): T;
   protected precompileChecks(_: Context): void {}
   public setName(name: string): this {
      (this as Mutable<this>).name = name;
      return this;
   }
   public getRuntimeValue(context: Context): T {
      if (!this.RUNTIME.has(context)) this.RUNTIME.set(context, this.compile(context));
      return this.RUNTIME.get(context)!;
   }
   public isCompiledFor(context: Context): boolean {
      return this.RUNTIME.has(context);
   }
}
