import { IndexedAccessor } from '@bedrock-apis/va-common';
import { ServerModuleTypeMap } from '@bedrock-apis/va-pluggable';
import { VanillaEntityIdentifier, Vector2, Vector3 } from '@minecraft/server';
import { CorePlugin, va } from '../core-plugin';
import { corePluginVanillaDataProvider } from '../dump/provider';
import { Dimension } from './dimension';
import { DynamicProperties } from './dynamic-properties';
import { validityGuard } from './validity';

type EntityComponentGroup = Readonly<Record<string, object>>;

export class EntityType extends va.server.class('EntityType') {
   @va.getter('id') public id: string;

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
      super();
      this.id = id;
   }
}

export class EntityTypes extends va.server.class('EntityTypes') {
   public static types: EntityType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.map(e => va.asHandle(e));
   }

   @va.static.method('get') public static get(id: string | VanillaEntityIdentifier) {
      id = CorePlugin.addNamespace(id as string);
      const result = this.types.find(e => e.id === id);
      return result ? va.asHandle(result) : result;
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

export class Entity extends va.server.class('Entity', DynamicProperties) {
   public constructor(
      identifier: string | ServerModuleTypeMap['EntityType']['prototype'],
      location: Vector3,
      dimension: Dimension,
      spawnOptions?: { event?: string; rotation?: Vector2 },
   ) {
      super();
      const typeId = typeof identifier === 'string' ? CorePlugin.addNamespace(identifier) : identifier.id;
      const type = EntityTypes.types.find(e => e.id === typeId);

      if (!type) throw new Error(`Invalid entity identifier ${typeId}`);

      this.typeId = typeId;
      this.localizationKey = type.entityData.localizationKey;

      this.location = location;
      this.dimension = dimension;
      this.rotation = spawnOptions?.rotation ?? { x: 0, y: 0 };
   }

   protected rotation: Vector2;

   @va.method('getRotation') public getRotation() {
      return this.rotation;
   }

   @va.method('setRotation') public setRotation(r: Vector2) {
      this.rotation = r;
   }

   @va.getter('localizationKey') public localizationKey: string;
   @va.property('isSneaking') public isSneaking = false;
   @va.property('nameTag') public nameTag = '';
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

   @validityGuard.isValid({
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
