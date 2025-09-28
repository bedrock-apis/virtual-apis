// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Needs rewrite

import { Plugin } from '@bedrock-apis/va-pluggable';
import { BlockPermutation, BlockType, Dimension, Vector3 } from '@minecraft/server';
import { blocks, localizationKeys } from './reports-provider';
import { ValidityPlugin } from './validity';

export class BlockTypesPlugin extends Plugin {
   public source = blocks;

   public blockTypes: BlockType[] = [];

   public override onInitialization(): void {
      const module = this.server;

      module.onLoad.subscribe(module => {
         for (const itemTypeId of Object.keys(this.source)) {
            this.blockTypes.push(this.itemType.create({ id: itemTypeId }));
         }
      });

      module.implementStatic('BlockTypes', {
         getAll() {
            return this.plugin.blockTypes;
         },
         get(itemId) {
            for (const itemType of this.plugin.blockTypes) {
               // Get storage to avoid expensive calls
               if (this.plugin.itemType.storage.get(itemType).id === itemId) return itemType;
            }
         },
      });
   }

   public itemType = this.server.implementWithStorage('BlockType', () => ({ id: '' }), {
      get id() {
         return this.storage.id;
      },
   });
}
BlockTypesPlugin.register('blockTypes');

export class BlockPlugin extends Plugin {
   public block = this.server.implementWithStorage(
      'Block',
      () => ({
         location: { x: 0, y: 0, z: 0 },
         dimension: undefined as unknown as Dimension,
         typeId: '',
         type: undefined as unknown as BlockType,
         permutation: undefined as unknown as BlockPermutation,
         langKey: '',
      }),
      {
         get typeId() {
            return this.storage.typeId;
         },
         get location() {
            return this.storage.location;
         },
         center() {
            return {
               x: this.storage.location.x + 0.5,
               y: this.storage.location.y + 0.5,
               z: this.storage.location.z + 0.5,
            };
         },
         bottomCenter() {
            return { x: this.storage.location.x + 0.5, y: this.storage.location.y, z: this.storage.location.z + 0.5 };
         },
         get localizationKey() {
            return this.storage.langKey;
         },
         setType(blockType) {
            const typeId = blockType instanceof this.module.resolve('BlockType') ? blockType.id : blockType;
            const type =
               blockType instanceof this.module.resolve('BlockType')
                  ? blockType
                  : this.module.resolve('BlockTypes').get(blockType)!;

            this.storage.typeId = typeId;
            this.storage.type = type;
         },
         setPermutation(permutation) {
            this.storage.permutation = permutation;
         },
         get type() {
            return this.storage?.type;
         },
         get permutation() {
            return this.storage?.permutation;
         },
      },
   );

   public create(location: Vector3, dimension: Dimension, typeId: string) {
      const block = this.block.create({
         location,
         dimension,
         langKey: localizationKeys.blocks[typeId] ?? '',
      });
      this.context.getPlugin(ValidityPlugin, 'creating block').block.validate(block);
      block.setType(typeId);
      return block;
   }
}
BlockPlugin.register('block');
