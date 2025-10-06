import { IndexedAccessor, Vector3 } from '@bedrock-apis/va-common';
import { CorePlugin } from '../core-plugin';
import { va } from '../decorators';
import { corePluginVanillaDataProvider } from '../dump/provider';
import { Dimension } from './dimension';

export class BlockType extends va.server.class('BlockType') {
   @va.getter('id') public id: string;
   public constructor(
      id: string,
      public readonly data: {
         localizationKey: string;
         tags: string[];
         components: Record<string, object>;
      },
   ) {
      super();
      this.id = id;
   }
}

export class BlockTypes extends va.server.class('BlockTypes') {
   public static types: BlockType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.slice();
   }

   @va.static.method('get') public static get(id: string) {
      const stringId = CorePlugin.addNamespace(id as string);
      return this.types.find(e => e.id === stringId);
   }
}

corePluginVanillaDataProvider.onRead.subscribe(({ blocks: { tags, components, blocks } }) => {
   if (!tags.length) return;
   const tagsAcc = new IndexedAccessor(tags);
   const componentsAcc = new IndexedAccessor(components);
   for (const [typeId, block] of Object.entries(blocks)) {
      const tags = block.tags.map(tagsAcc.fromIndex);
      const components = Object.fromEntries(block.components.map(componentsAcc.fromIndex).map(e => [e.typeId, e.data]));

      BlockTypes.types.push(
         new BlockType(typeId, {
            ...block,
            tags,
            components,
         }),
      );
   }
});

export class Block extends va.server.class('Block') {
   public constructor(location: Vector3, dimension: Dimension, type?: BlockType | string) {
      super();
      if (typeof type === 'string') {
         type = BlockTypes.get(type);
         if (!type) throw new Error(`Unknown block type ${type}`);
      }

      this.location = location;
      this.dimension = dimension;
      this.type = type;
   }

   @va.getter('location') public location: Vector3;
   @va.getter('dimension') public dimension: Dimension;
   @va.getter('permutation') public permutation?: BlockPermutation;
   @va.getter('type') public type?: BlockType;
   @va.getter('localizationKey') public get localizationKey() {
      return this.type?.data.localizationKey;
   }
   @va.getter('typeId') public get typeId() {
      return this.type?.id;
   }

   @va.method('setType') public setType(type: BlockType) {
      this.type = type;
   }

   @va.method('setPermutation') public setPermutation(permutation: BlockPermutation) {
      this.permutation = permutation;
   }

   @va.method('center') public center() {
      return {
         x: this.location.x + 0.5,
         y: this.location.y + 0.5,
         z: this.location.z + 0.5,
      };
   }

   @va.method('bottomCenter') public bottomCenter() {
      return { x: this.location.x + 0.5, y: this.location.y, z: this.location.z + 0.5 };
   }
}

export class BlockPermutation extends va.server.class('BlockPermutation') {}
