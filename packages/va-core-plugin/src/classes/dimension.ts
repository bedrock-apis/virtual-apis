import { MapWithDefaults, VectorXZ } from '@bedrock-apis/va-common';
import { EntityIdentifierType, SpawnEntityOptions, Vector3 } from '@minecraft/server';
import { va } from '../decorators';
import { Block, BlockPermutation, BlockType } from './block';
import { Entity, EntityType } from './entity';
import { ItemStack } from './item-stack';
import { MolangVariableMap } from './molang-variables';

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
      return this.types.slice();
   }

   @va.static.method('get')
   public static get(id: string) {
      return this.types.find(e => e.typeId === id);
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
      id: EntityIdentifierType<unknown> | EntityType,
      location: Vector3,
      options?: SpawnEntityOptions | undefined,
   ) {
      const typeId = typeof id === 'string' ? id : id.id;
      const entity = new Entity(typeId, location, this, {
         event: options?.spawnEvent,
         rotation: options?.initialRotation,
      });

      return entity;
   }

   protected chunks = new MapWithDefaults<string, Chunk>();
   protected getChunk(location: Vector3) {
      return this.chunks.get(Chunk.getKey(location.x, location.z));
   }
   protected getOrCreateChunk(location: Vector3) {
      return this.chunks.getOrCreate(
         Chunk.getKey(location.x, location.z),
         () => new Chunk(location.x, location.z, this),
      );
   }

   @va.method('spawnParticle') public spawnParticle(
      effectName: string,
      location: Vector3,
      molangVariables: MolangVariableMap,
   ) {}

   @va.method('spawnItem') public spawnItem(itemStack: ItemStack, location: Vector3) {
      const entity = new Entity('minecraft:item', location, this, {});
      // TODO Set item component
      return entity;
   }

   @va.method('getBlock')
   public getBlock(location: Vector3) {
      return this.chunks.get(Chunk.getKey(location.x, location.z))?.getBlock(location);
   }

   @va.method('setBlockType')
   public setBlockType(location: Vector3, blockType: BlockType | string) {
      const block = new Block(location, this, blockType);
      this.getOrCreateChunk(location).setBlock(location, block);
   }

   @va.method('setBlockPermutation')
   public setBlockPermutation(location: Vector3, permutation: BlockPermutation) {
      const block = this.getOrCreateChunk(location).getOrPlaceBlock(location);
      block.setPermutation(permutation);
   }
}

export class Chunk {
   public static size = 16;

   public static getIndexes(x: number, z: number) {
      const indexX = Math.floor(x / this.size);
      const indexZ = Math.floor(z / this.size);

      return { indexX, indexZ };
   }

   public static getKey(x: number, z: number) {
      return `${Math.floor(x / this.size)} ${Math.floor(z / this.size)}`;
   }

   public readonly indexX: number;
   public readonly indexZ: number;

   public readonly from: VectorXZ;
   public readonly to: VectorXZ;

   public constructor(
      x: number,
      z: number,
      protected dimension: Dimension,
   ) {
      this.indexX = Math.floor(x / Chunk.size);
      this.indexZ = Math.floor(z / Chunk.size);

      this.from = { x: this.indexX * Chunk.size, z: this.indexZ * Chunk.size };
      this.to = { x: this.from.x + Chunk.size - 1, z: this.from.z + Chunk.size - 1 };
   }

   protected readonly blocks = new MapWithDefaults<string, Block>();
   public getBlock(location: Vector3) {
      return this.blocks.get(locationToString(location));
   }
   public getOrPlaceBlock(location: Vector3) {
      return this.blocks.getOrCreate(locationToString(location), () => new Block(location, this.dimension));
   }
   public setBlock(location: Vector3, block: Block) {
      return this.blocks.set(locationToString(location), block);
   }
   public readonly entities = new Set();
}

function locationToString(location: Vector3) {
   return `${location.x} ${location.y} ${location.z}`;
}
