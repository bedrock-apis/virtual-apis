import type { Context } from '../context/base';

export abstract class CompilableSymbol<T> {
   // Do not expose this property yet, maybe it will be an map of (Context -> ApiValue)
   private readonly RUNTIME: T | null = null;
   public readonly name!: string;
   protected abstract compile(context: Context): T;
   protected precompileChecks(_: Context): void {}
   public setName(name: string): this {
      (this as Mutable<this>).name = name;
      return this;
   }
   public getRuntimeValue(context: Context): T {
      //@ts-expect-error We expect that this throws as runtime property is not assignable
      return this.RUNTIME === null ? (this.RUNTIME = this.compile(context)) : this.RUNTIME;
   }
}
