import { Block, Entity } from '@minecraft/server';
import { TestEnvironment } from './environment';

export class VirtualApiEnvironment extends TestEnvironment {
   public async onSetup() {
      // Nothing
   }

   public spawnEntity(typeId: string): Entity {
      // @ts-expect-error types bypass
      return new Entity();
   }

   public placeBlock(typeId: string): Block {
      // @ts-expect-error types bypass
      return new Block();
   }
}
