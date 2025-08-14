import type { Block, Entity, Vector3 } from '@minecraft/server';

export abstract class TestEnvironment {
   public abstract onSetup(): Promise<void>;
   public abstract spawnEntity(typeId: string): Entity;
   public abstract placeBlock(typeId: string): Block;

   private nextLocations = new Map<string, Vector3>();

   protected getNextLocation(
      targetType: string,
      baseLocation: Vector3,
      offsetCoordinate: keyof Vector3 = 'x',
      offsetNumber: number = 1,
   ): Vector3 {
      let previousOffset = this.nextLocations.get(targetType);
      if (!previousOffset) {
         previousOffset = baseLocation;
         this.nextLocations.set(targetType, previousOffset);
      }

      previousOffset[offsetCoordinate] += offsetNumber;
      return {
         x: previousOffset.x,
         y: previousOffset.y,
         z: previousOffset.z,
      };
   }
}

let globalEnvironment: TestEnvironment | null = null;

export function getEnvironment(): TestEnvironment {
   if (!globalEnvironment) throw new Error('You should setup test Environment first');

   return globalEnvironment;
}

export function setEnvironment(Environment: TestEnvironment) {
   globalEnvironment = Environment;
}
export function spawnEntity(typeId: string): Entity {
   return getEnvironment().spawnEntity(typeId);
}
export function placeBlock(typeId: string): Block {
   return getEnvironment().placeBlock(typeId);
}
