import { MapWithDefaults } from '@bedrock-apis/common';
import { Plugin } from '@bedrock-apis/va-pluggable';
import { ImplStoraged } from '@bedrock-apis/va-pluggable/src/implementation';
import { PluginModuleLoaded } from '@bedrock-apis/va-pluggable/src/module';
import { type Block, type Dimension, type Vector3, type VectorXZ } from '@minecraft/server';
import { BlockPlugin } from './block';
import { EntityPlugin } from './entity';

export class DimensionPlugin extends Plugin {
   public dimension: ImplStoraged<{ id: string }, Dimension> = this.server.implementWithStorage(
      'Dimension',
      (_, mod, plugin) => ({
         id: '',
         chunks: new MapWithDefaults<string, Chunk>(),
         getChunk(location: Vector3) {
            return this.chunks.get(Chunk.getKey(location.x, location.z));
         },
         getOrCreateChunk(location: Vector3) {
            return this.chunks.getOrCreate(
               Chunk.getKey(location.x, location.z),
               () => new Chunk(location.x, location.z, mod, plugin.getPlugin(BlockPlugin)),
            );
         },
      }),
      {
         spawnEntity(identifier, location, options) {
            const entityPlugin = this.getPlugin(EntityPlugin);

            const entity = entityPlugin.createEntity(location, this.instance as Dimension, identifier);
            if (options?.initialPersistence) {
               // Huh
            }
            if (options?.initialRotation) {
               entityPlugin.entity.storage.get(entity).rotation.x = options.initialRotation;
            }
            if (options?.spawnEvent) {
               // TODO Trigger event on entity. Entity should call the actual event
            }

            return entity;
         },
         spawnParticle(effectName, location, molangVariables) {},
         spawnItem(itemStack, location) {
            const entityPlugin = this.getPlugin(EntityPlugin);
            const entity = entityPlugin.createEntity(location, this.instance as Dimension, 'minecraft:item');
            const storage = entityPlugin.entity.storage.get(entity);
            // TODO Set item component
            return entity;
         },
         get id() {
            return this.storage.id;
         },

         getBlock(location) {
            return this.storage.chunks.get(Chunk.getKey(location.x, location.z))?.getBlock(location);
         },
         setBlockType(location, blockType) {
            const block = this.getPlugin(BlockPlugin).create(
               location,
               this.instance,
               blockType instanceof this.module.resolve('BlockType') ? blockType.id : blockType,
            );
            this.storage.getOrCreateChunk(location).setBlock(location, block);
         },
         setBlockPermutation(location, permutation) {
            const block = this.storage.getOrCreateChunk(location).getOrPlaceBlock(location);
            block.setPermutation(permutation);
         },
      },
   );

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
      protected readonly mod: PluginModuleLoaded,
      protected readonly blockPlugin: BlockPlugin,
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
      return this.blocks.getOrCreate(locationToString(location), () => this.mod.construct('Block'));
   }
   public setBlock(location: Vector3, block: Block) {
      return this.blocks.set(locationToString(location), block);
   }
   public readonly entities = new Set();
}

function locationToString(location: Vector3) {
   return `${location.x} ${location.y} ${location.z}`;
}
