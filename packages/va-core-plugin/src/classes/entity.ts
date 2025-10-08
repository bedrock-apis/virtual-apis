import { IndexedAccessor } from '@bedrock-apis/va-common';
import { EntityIdentifierType, Vector2, Vector3 } from '@minecraft/server';
import { va } from '../decorators';
import { corePluginVanillaDataProvider } from '../dump/provider';
import { Component, Components } from './components';
import { Dimension } from './dimension';
import { DynamicProperties } from './dynamic-properties';
import { BaseType } from './helpers';
import { isValid } from './validity';
import { CorePlugin } from '../core-plugin';

type EntityComponentGroup = Readonly<Record<string, object>>;

export class EntityType extends va.server.class('EntityType', BaseType) {
   public constructor(
      id: string,
      public readonly entityData: Readonly<{
         identifier: string;
         properties: object;
         localizationKey: string;
         components: EntityComponentGroup;
         componentsGroups: Map<string, EntityComponentGroup>;
      }>,
   ) {
      super([id]);
      this.id = id;
   }
}

export class EntityTypes extends va.server.class('EntityTypes') {
   public static types: EntityType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.slice();
   }

   @va.static.method('get') public static get(id: EntityIdentifierType<unknown>) {
      const stringId = CorePlugin.addNamespace(id as string);
      return this.types.find(e => e.id === stringId);
   }
}

corePluginVanillaDataProvider.onRead.subscribe(({ entities: { components, entities } }) => {
   const componentAcc = new IndexedAccessor(components);
   for (const [typeId, entity] of Object.entries(entities)) {
      const type = new EntityType(typeId, {
         identifier: typeId,
         properties: {},
         localizationKey: entity.localizationKey,
         components: Object.fromEntries(
            entity.components.map(e => componentAcc.fromIndex(e)).map(e => [e.typeId, e.data]),
         ),
         componentsGroups: new Map(),
      });
      EntityTypes.types.push(type);
   }
});

class EntityComponent extends va.server.class('EntityComponent', Component) {}

export class Entity extends va.server.class('Entity', DynamicProperties, Components) {
   public constructor(
      identifier: string,
      location: Vector3,
      dimension: Dimension,
      spawnOptions?: { event?: string; rotation?: number },
   ) {
      super([], []);
      const typeId = CorePlugin.addNamespace(identifier);
      const type = EntityTypes.types.find(e => e.id === typeId);

      if (!type) throw new Error(`Invalid entity identifier ${typeId}`);

      this.typeId = typeId;
      this.localizationKey = type.entityData.localizationKey;

      this.location = location;
      this.dimension = dimension;
      this.rotation = spawnOptions?.rotation ? { y: spawnOptions?.rotation, x: 0 } : { x: 0, y: 0 };
   }

   protected rotation: Vector2;

   @va.method('getRotation') public getRotation() {
      return this.rotation;
   }

   @va.method('setRotation') public setRotation(r: Vector2) {
      this.rotation = r;
   }

   @va.method('getComponents') public override getComponents() {
      return super.getComponents();
   }

   @va.getter('localizationKey') public localizationKey: string;
   @va.property('isSneaking') public isSneaking = false;
   @va.property('nameTag') public nameTag: undefined | string = undefined;
   @va.getter('dimension') public dimension: Dimension;
   @va.getter('location') public location: Vector3;
   @va.getter('typeId') public readonly typeId: string;
   @va.getter('isSwimming') public isSwimming = false;
   @va.getter('isClimbing') public isClimbing = false;
   @va.getter('isSprinting') public isSprinting = false;
   @va.getter('isOnGround') public get isOnGround() {
      return !this.isFalling;
   }
   @va.getter('isFalling') public get isFalling() {
      // TODO Check for blocks below
      return this.dimension ? true : false;
   }

   @va.getter('isSleeping') public get isSleeping() {
      return true;
   }

   @isValid({
      ignore: ['typeId'],
      error: class InvalidActorError extends Error {
         public override name = 'InvalidActorError';
      } as typeof Error,
   })
   public isValid = true;

   protected tags = new Set<string>();
   @va.method('getTags') public getTags() {
      return [...this.tags];
   }

   @va.method('addTag') public addTag(tag: string) {
      if (this.tags.has(tag)) return false;
      this.tags.add(tag);
      return true;
   }

   @va.method('hasTag') public hasTag(tag: string) {
      return this.tags.has(tag);
   }

   @va.method('remove') public remove() {
      this.isValid = false;
   }
}
