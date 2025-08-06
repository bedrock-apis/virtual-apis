import { createConstructableFunction, finalizeAsConstructable } from '../ecma-factories';
import { InvocableSymbol } from './invocable';

export class ConstructableSymbol extends InvocableSymbol<new (...params: unknown[]) => unknown> {
   public readonly parent: ConstructableSymbol | null = null;
   public setParent(parent: ConstructableSymbol): this {
      (this as Mutable<this>).parent = parent;
      return this;
   }
   public override compile(): new (...params: unknown[]) => unknown {
      const ctor = createConstructableFunction(() => {
         // Logic we had in factories before
      });

      // We don't want to compile its value
      finalizeAsConstructable(ctor, this.name, this.paramsLength, this.parent?.getRuntimeValue() ?? null);
      return ctor;
   }
}
