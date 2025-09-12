import { Plugin } from '@bedrock-apis/va-pluggable';
import { Dimension } from '@minecraft/server';
import { EntityPlugin } from './entity';

export class DimensionPlugin extends Plugin {
   public storage = this.serverBeta.implementWithStorage('Dimension', () => ({}), {
      spawnEntity(identifier, location, options) {
         const entityPlugin = this.module.plugin.context.getPluginForce(EntityPlugin, this.invocation);

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
   });
}
DimensionPlugin.register('dimension');
