import { Kernel } from '@bedrock-apis/kernel-isolation';
import { Type } from '../../type-validators';
import { ModuleContext } from '../module-context';
import { BaseExecutionParams } from './class';

export abstract class APISymbol<
   A extends object = object,
   T extends Type | undefined = Type | undefined,
> extends Kernel.Empty {
   public constructor(
      public readonly context: ModuleContext,
      public readonly name: string,
   ) {
      super();
   }

   protected invocable(id: string) {
      if (this.context.symbols.has(id)) throw new Kernel['globalThis::Error'](`Symbol with id ${id} already exists!`);
      this.context.symbols.set(id, this);
      this.invocableId = id;
   }

   public invocableId?: string;

   public interactionHandler?: (...params: BaseExecutionParams) => void;

   private apiCache?: A;

   public get api() {
      return (this.apiCache ??= this.compile());
   }

   protected abstract compile(): A;

   public type = undefined as T;
}
