import { Plugin } from '@bedrock-apis/va-pluggable';
import { Dimension, Vector3 } from '@minecraft/server';
import { localizationKeys } from './reports-provider';
import { ValidityPlugin } from './validity';

export class BlockPlugin extends Plugin {
   public block = this.server.implementWithStorage(
      'Block',
      () => ({
         location: { x: 0, y: 0, z: 0 },
         dimension: undefined as unknown as Dimension,
         typeId: '',
         langKey: '',
      }),
      {
         get typeId() {
            return this.storage.typeId;
         },
         get location() {
            return this.storage.location;
         },
         set location(v) {
            // @ts-expect-error bruh ts i hate you
            this.storage.location = v;
         },
         get localizationKey() {
            return this.storage.langKey;
         },
      },
   );

   public create(location: Vector3, dimension: Dimension, typeId: string) {
      const block = this.block.create({
         location,
         dimension,
         typeId,
         langKey: localizationKeys.blocks[typeId] ?? '',
      });
      this.context.getPlugin(ValidityPlugin, 'creating block').block.validate(block);
      return block;
   }
}
BlockPlugin.register('block');
