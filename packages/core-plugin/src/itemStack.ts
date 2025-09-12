import { Plugin } from '@bedrock-apis/va-pluggable';
import type { ItemType } from '@minecraft/server';
import { items as itemsReport } from './reports-provider';

export class ItemTypesPlugin extends Plugin {
   public source = itemsReport;

   public itemTypes: ItemType[] = [];

   public override onInitialization(): void {
      const self = this;
      const module = this.serverBeta;

      module.onLoad = () => {
         for (const itemTypeId of Object.keys(this.source.items)) {
            const itemType = module.construct('ItemType');
            const storage = this.itemType.getStorage(itemType);
            storage.id = itemTypeId;
            this.itemTypes.push(itemType);
         }
      };

      module.implementStatic('ItemTypes', {
         getAll() {
            return self.itemTypes;
         },
         get(itemId) {
            for (const itemType of self.itemTypes) {
               // Get storage to avoid expensive calls
               if (self.itemType.getStorage(itemType).id === itemId) return itemType;
            }
         },
      });
   }

   public itemType = this.serverBeta.implementWithStorage('ItemType', () => ({ id: '' }), {
      get id() {
         return this.storage.id;
      },
   });
}
ItemTypesPlugin.register('itemTypes');

export class ItemStackPlugin extends Plugin {
   public storage = this.serverBeta.implementWithStorage(
      'ItemStack',
      () => ({
         canDestroy: [] as string[],
         itemType: '',
         amount: 0,
      }),
      {
         constructor(itemType, amount) {
            this.storage.itemType = itemType instanceof this.module.resolve('ItemType') ? itemType.id : itemType;
            this.storage.amount = amount ?? 1; // We need to somehow tell type system that default value is set
         },
         get typeId() {
            return this.storage.typeId;
         },
         getCanDestroy() {
            return this.storage.canDestroy;
         },
         setCanDestroy(blockIdentifiers) {
            this.storage.canDestroy = blockIdentifiers ?? [];
         },
      },
   );
}
ItemStackPlugin.register('itemStack');
