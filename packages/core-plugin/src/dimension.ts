import { MapWithDefaults } from '@bedrock-apis/common';
import { Plugin } from '@bedrock-apis/va-pluggable';
import type { Dimension } from '@minecraft/server';
import { EntityPlugin } from './entity';

export class DimensionPlugin extends Plugin {
   public dimension = this.server.implementWithStorage('Dimension', () => ({ id: '' }), {
      spawnEntity(identifier, location, options) {
         const entityPlugin = this.getPlugin(EntityPlugin);

         const entity = entityPlugin.createEntity(location, this.instance as Dimension, identifier);
         if (options?.initialPersistence) {
            // Huh
         }
         if (options?.initialRotation) {
            entityPlugin.entity.getStorage(entity).rotation.x = options.initialRotation;
         }
         if (options?.spawnEvent) {
            // TODO Trigger event on entity. Entity should call the actual event
         }

         return entity;
      },
      get id() {
         return this.storage.id;
      },
   });

   public worldStorage = this.server.implementWithStorage(
      'World',
      () => ({
         dimensions: new MapWithDefaults<string, Dimension>(),
      }),
      {
         getDimension(dimensionId) {
            return this.storage.dimensions.getOrCreate(dimensionId, () =>
               this.plugin.dimension.create({ id: dimensionId }),
            );
         },
      },
   );
}
DimensionPlugin.register('dimension');
