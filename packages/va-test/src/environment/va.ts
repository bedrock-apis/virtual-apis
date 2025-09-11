import { Block, Entity } from '@minecraft/server';
import { TestEnvironment } from './environment';
import { ConstructableSymbol, Context, ContextPlugin } from '@bedrock-apis/virtual-apis';

export class VirtualApiEnvironment extends TestEnvironment {
   public async onSetup() {
      // Nothing
   }

   public spawnEntity(typeId: string): Entity {
      // @ts-expect-error types bypass
      return this.instanc("Entity")
   }

   public placeBlock(typeId: string): Block {
      // @ts-expect-error types bypass
      return this.instanc("Block")
   }

   public ctx: Context = Context.getContext(0)!;

   public instanc(instanceClassId: string) {
      const symbol = this.ctx.modules.get('@minecraft/server')?.symbolsMap.get(instanceClassId);
      if (!(symbol instanceof ConstructableSymbol)) throw new Error('Non constructable');

      return symbol?.createRuntimeInstanceInternal(this.ctx);
   }
}
