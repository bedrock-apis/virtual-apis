import { CompilableSymbol } from './general';

export abstract class InvocableSymbol<T> extends CompilableSymbol<T> {
   public readonly identifier!: string;
   public readonly paramsLength!: number;
   public setParamsLength(length: number) {
      (this as Mutable<this>).paramsLength = length;
   }
   public override setName(name: string): this {
      (this as Mutable<this>).identifier = name;
      return this;
   }
}
