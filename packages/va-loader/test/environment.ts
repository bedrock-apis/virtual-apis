import type { Block, Entity } from '@minecraft/server';
import { TestEnvironment } from '../../../bds-docs/test-runner/environment';

export class VirtualApiEnvironment extends TestEnvironment {
   public async onSetup() {
      // Nothing
   }

   public spawnEntity(typeId: string): Entity {
      // @ts-expect-error types mismatch
      return new Entity();
   }

   public placeBlock(typeId: string): Block {
      // @ts-expect-error types mismatch
      return new Block();
   }
}
