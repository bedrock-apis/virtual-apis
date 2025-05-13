import { Block, Entity } from '@minecraft/server';
import { TestEnviroment } from 'bds-docs/script-api/test-runner/enviroment';

export class VirtualApiEnviroment extends TestEnviroment {
   public onSetup(): void {
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
