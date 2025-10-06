import { va } from '../decorators';

export class BaseType extends va.server.base(['BlockType', 'EntityType', 'ItemType', 'EnchantmentType', 'BiomeType']) {
   @va.getter('id')
   public id: string;

   public constructor(id: string) {
      super();
      this.id = id;
   }
}
