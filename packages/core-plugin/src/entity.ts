import { Plugin } from '@bedrock-apis/va-pluggable';
import type { Dimension, Entity, Player, Vector3 } from '@minecraft/server';
import { localizationKeys } from './reports-provider';
import { ValidityPlugin } from './validity';

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

            remove() {
               this.getPlugin(ValidityPlugin).entity.invalidate(this.instance);
            },
         },
         true,
      );
   }

   public entity = this.impl('Entity');
   public player = this.impl('Player');

   public createEntity = this.create.bind(this, 'entity') as (
      location: Vector3,
      dimension: Dimension,
      typeId: string,
   ) => Entity;

   public createPlayer = this.create.bind(this, 'player') as (
      location: Vector3,
      dimension: Dimension,
      typeId: string,
   ) => Player;

   protected create(property: 'entity' | 'player', location: Vector3, dimension: Dimension, typeId: string) {
      const entity = this[property].create({
         typeId,
         location,
         dimension,
         localizationKey: localizationKeys.entities[typeId] ?? '',
      });
      this.context.getPlugin(ValidityPlugin, `creating ${property}`).entity.validate(entity);
      return entity;
   }
}
EntityPlugin.register('entity');
