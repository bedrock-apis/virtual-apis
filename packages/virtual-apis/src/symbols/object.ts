import { Context } from '../main';
import { ConstructableSymbol } from './abstracts';
import { CompilableSymbol } from './abstracts/compilable';

export class ObjectValueSymbol extends CompilableSymbol<object> {
   public readonly constructable!: ConstructableSymbol;
   public readonly constants = new Map();
   public readonly values = new Set();
   protected override compile(context: Context): object {
      this.constructable.compile(context);
      return this.constructable.createHandleInternal(context);
   }
   protected override precompileChecks(_: Context): void {
      if (!this.constructable) throw new ReferenceError('Constructable property is required for compilation');
   }
   public setConstructable(ctor: ConstructableSymbol): this {
      (this as Mutable<this>).constructable = ctor;
      return this;
   }
}
