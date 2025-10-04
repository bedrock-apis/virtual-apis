import { ServerModuleTypeMap } from '@bedrock-apis/va-pluggable/src/types';
import { SpawnEntityOptions, Vector3 } from '@minecraft/server';
import { va } from '../core-plugin';
import { Entity } from './entity';

export class DimensionType extends va.server.class('DimensionType') {
   @va.getter('typeId')
   public typeId: string;

   public constructor(typeId: string) {
      super();
      this.typeId = typeId;
   }
}

export class DimensionTypes extends va.server.class('DimensionTypes') {
   public static types = [
      new DimensionType('minecraft:overworld'),
      new DimensionType('minecraft:nether'),
      new DimensionType('minecraft:the_end'),
   ];

   @va.static.method('getAll')
   public static getAll() {
      return this.types.map(e => va.asHandle(e));
   }

   @va.static.method('get')
   public static get(id: string) {
      const r = this.types.find(e => e.typeId === id);
      return r ? va.asHandle(r) : r;
   }
}

export class Dimension extends va.server.class('Dimension') {
   public constructor(type: DimensionType) {
      super();
      this.id = type.typeId;
   }

   @va.getter('id')
   public id: string;

   @va.method('spawnEntity')
   public spawnEntity(
      id: string | ServerModuleTypeMap['EntityType']['prototype'],
      location: Vector3,
      options?: SpawnEntityOptions | undefined,
   ) {
      const typeId = typeof id === 'string' ? id : id.id;
      const entity = new Entity(typeId, location, this);

      return va.asHandle(entity);
   }
}
