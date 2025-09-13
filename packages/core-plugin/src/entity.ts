import { Plugin } from '@bedrock-apis/va-pluggable';
import { PluginModuleLoaded } from '@bedrock-apis/va-pluggable/src/module';
import type { Dimension, Entity, Player, Vector3 } from '@minecraft/server';
import { localizationKeys } from './reports-provider';

export class EntityPlugin extends Plugin {
   public impl(name: 'Entity' | 'Player') {
      return this.server.implementWithStorage(
         name,
         () => ({
            typeId: '',
            location: { x: 0, y: 0, z: 0 },
            localizationKey: '',
            rotation: { x: 0, y: 0 },
            dimension: undefined as unknown as Dimension,
         }),
         {
            get typeId() {
               return this.storage.typeId;
            },
            get localizationKey() {
               return this.storage.localizationKey;
            },
            get location() {
               return this.storage.location;
            },
            set location(v) {
               // @ts-expect-error huh idk how to set setter this type
               this.storage.location = v;
            },

            get dimension() {
               return this.storage.dimension;
            },

            getRotation() {
               return this.storage.rotation;
            },
            setRotation(rotation) {
               this.storage.rotation = rotation;
            },
         },
      );
   }

   public entity = this.impl('Entity');
   public player = this.impl('Player');

   public createEntity!: (location: Vector3, dimension: Dimension, typeId: string) => Entity;
   public createPlayer!: (location: Vector3, dimension: Dimension, typeId: string) => Player;

   protected _ = this.server.onLoad.subscribe(loaded => {
      this.createEntity = this.create.bind(this, loaded, 'Entity', 'entity');
      this.createPlayer = this.create.bind(this, loaded, 'Player', 'player');
   });

   protected create(
      loaded: PluginModuleLoaded,
      className: 'Entity' | 'Player',
      property: 'entity' | 'player',
      location: Vector3,
      dimension: Dimension,
      typeId: string,
   ) {
      const entity = loaded.construct(className);
      const storage = this[property].getStorage(entity);
      storage.typeId = typeId;
      storage.location = location;
      storage.dimension = dimension;
      storage.localizationKey = localizationKeys.entities[typeId] ?? '';
      return entity;
   }
}
EntityPlugin.register('entity');
