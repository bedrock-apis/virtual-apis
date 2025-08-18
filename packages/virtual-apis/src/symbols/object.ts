import { Context, IBindableSymbol } from '../main';
import { CompilableSymbol } from './abstracts/compilable';
import { ConstructableSymbol } from './constructable';

const { defineProperty } = Reflect;
export class ObjectValueSymbol extends CompilableSymbol<object> {
   public readonly constructable!: ConstructableSymbol;
   //public readonly constants = new Map();
   //public readonly values = new Set();
   protected override compile(context: Context): object {
      this.constructable.compile(context);
      return this.constructable.createRuntimeInstanceInternal(context);
   }
   protected override precompileChecks(_: Context): void {
      if (!this.constructable) throw new ReferenceError('Constructable property is required for compilation');
   }
   public setConstructable(ctor: ConstructableSymbol): this {
      (this as Mutable<this>).constructable = ctor;
      return this;
   }
}

export class ConstantValueSymbol extends CompilableSymbol<unknown> implements IBindableSymbol {
   public readonly value: unknown;
   protected override compile(): unknown {
      return this.value;
   }
   public setValue(value: unknown): this {
      (this as Mutable<this>).value = value;
      return this;
   }
   public compileAssignment(context: Context, runtime: unknown): void {
      defineProperty(runtime as object, this.name, {
         configurable: true,
         writable: true,
         enumerable: true,
         value: this.getRuntimeValue(context),
      });
   }
}
