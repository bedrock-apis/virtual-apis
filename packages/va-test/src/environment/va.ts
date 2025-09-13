import { ConstructableSymbol, Context } from '@bedrock-apis/virtual-apis';
import { Block, Entity, VanillaEntityIdentifier, world } from '@minecraft/server';
import { TestEnvironment } from './environment';

export class VirtualApiEnvironment extends TestEnvironment {
   public async onSetup() {
      // Nothing
   }

   public spawnEntity(typeId: string): Entity {
      const location = this.getNextLocation('entity', { x: 0, y: 0, z: 1 }, 'z');
      const entity = world.getDimension('overworld').spawnEntity(typeId as VanillaEntityIdentifier, location);

      return entity;
   }

   public placeBlock(typeId: string): Block {
      // @ts-expect-error types bypass
      return this.instanc('Block');
   }

   public ctx: Context = Context.getContext(0)!;

   public instanc(instanceClassId: string) {
      const symbol = this.ctx.modules.get('@minecraft/server')?.symbols.get(instanceClassId);
      if (!(symbol instanceof ConstructableSymbol)) throw new Error('Non constructable');

      return symbol?.createRuntimeInstanceInternal(this.ctx);
   }
}
