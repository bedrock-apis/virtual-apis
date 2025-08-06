export abstract class CompilableSymbol<T> {
   public readonly runtime: T | null = null;
   public readonly name!: string;
   protected abstract compile(): T;
   public setName(name: string): this {
      (this as Mutable<this>).name = name;
      return this;
   }
   public getRuntimeValue(): T {
      return this.runtime === null ? ((this as Mutable<this>).runtime = this.compile()) : this.runtime;
   }
}
