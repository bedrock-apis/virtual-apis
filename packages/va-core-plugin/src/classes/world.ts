import { CorePlugin } from '../core-plugin';

// The maintainability is the most important factor, this abstraction is not yet perfect but already simplifies things a lot
@CorePlugin.Class('@minecraft/server-bindings::World')
export class World {
   @CorePlugin.Get('@minecraft/server-bindings::World::afterEvents')
   public readonly afterEvents = new WorldAfterEvents();
}
export const world = new World();
CorePlugin.registryModuleObjectVariable('@minecraft/server-bindings::world', world);

@CorePlugin.Class('@minecraft/server-bindings::WorldAfterEvents')
export class WorldAfterEvents {}
