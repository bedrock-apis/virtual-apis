import { Vector2, Vector3 } from '@minecraft/server';
import { va } from '../core-plugin';

class EntityType extends va.server.class('EntityType') {
   @va.getter('id') public id: string;

   public constructor(id: string) {
      super();
      this.id = id;
   }
}

export class EntityTypes extends va.server.class('EntityTypes') {
   public static types: EntityType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.map(e => va.asHandle(e));
   }
}

export class Dimension extends va.server.class('Dimension') {}

type EntityComponentGroup = Record<string, object>;

interface EntityData {
   identifier: string;
   properties: object;
   components: EntityComponentGroup;
   componentsGroups: Map<string, EntityComponentGroup>;
}

// TODO Move to CorePlugin static property
const entityDataSource = new Map<string, EntityData>();

export class Entity extends va.server.class('Entity') {
   public constructor(
      typeId: string,
      location: Vector3,
      dimension: Dimension,
      spawnOptions?: { event?: string; rotation?: Vector2 },
   ) {
      super();

      const data = entityDataSource.get(typeId);
      if (!data) throw new Error(`Unknown entity type ${typeId}`);
      this.typeId = typeId;

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
}
