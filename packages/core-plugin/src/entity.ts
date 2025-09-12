import { Plugin } from '@bedrock-apis/va-pluggable';
import type { Dimension, Vector3 } from '@minecraft/server';
import { localizationKeys } from './reports-provider';

export class EntityPlugin extends Plugin {
   public impl(name: 'Entity' | 'Player') {
      return this.serverBeta.implementWithStorage(
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

   protected create(
      className: 'Entity' | 'Player',
      property: 'entity' | 'player',
      location: Vector3,
      dimension: Dimension,
      typeId: string,
   ) {
      const entity = this.serverBeta.construct(className);
      const storage = this[property].getStorage(entity);
      storage.typeId = typeId;
      storage.location = location;
      storage.dimension = dimension;
      storage.localizationKey = localizationKeys.entities[typeId] ?? '';
      return entity;
   }

   public createEntity = this.create.bind(this, 'Entity', 'entity');
   public createPlayer = this.create.bind(this, 'Player', 'player');
}
EntityPlugin.register('entity');
