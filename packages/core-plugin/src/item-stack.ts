import { Plugin } from '@bedrock-apis/va-pluggable';
import type { ItemStack, ItemType } from '@minecraft/server';
import { items as itemsReport, localizationKeys } from './reports-provider';

export class ItemTypesPlugin extends Plugin {
   public source = itemsReport;

   public itemTypes: ItemType[] = [];

   public override onInitialization(): void {
      const module = this.server;

      module.onLoad.subscribe(module => {
         for (const itemTypeId of Object.keys(this.source)) {
            this.itemTypes.push(this.itemType.create({ id: itemTypeId }));
         }
      });

      module.implementStatic('ItemTypes', {
         getAll() {
            return this.plugin.itemTypes;
         },
         get(itemId) {
            for (const itemType of this.plugin.itemTypes) {
               // Get storage to avoid expensive calls
               if (this.plugin.itemType.storage.get(itemType).id === itemId) return itemType;
            }
         },
      });
   }

   public itemType = this.server.implementWithStorage('ItemType', () => ({ id: '' }), {
      get id() {
         return this.storage.id;
      },
   });
}
ItemTypesPlugin.register('itemTypes');

export class ItemStackPlugin extends Plugin {
   // @ts-expect-error HUHH? wtf is this
   public itemStack = this.server.implementWithStorage(
      'ItemStack',
      (_, mod) => ({
         typeId: '',
         amount: 0,
         canDestroy: [] as string[],
         canPlaceOn: [] as string[],
         maxAmount: 0,
         langKey: '',
         lockMode: mod.resolve('ItemLockMode').none,
      }),
      {
         constructor(itemType, amount = 1) {
            const typeId = itemType instanceof this.module.resolve('ItemType') ? itemType.id : itemType;
            const itemTypes = this.getPlugin(ItemTypesPlugin);
            const info = itemTypes.source.items[typeId];
            if (!info) throw new Error(`Invalid item identifier '${typeId}'.`);
            // if (amount > info.maxStack) throw new Error('Max stack'); // TODO, mc does not really throws there lol

            this.storage.maxAmount = info.maxStack;
            this.storage.typeId = typeId;
            this.storage.amount = amount; // We need to somehow tell type system that default value is set
            this.storage.langKey = localizationKeys.items[typeId] ?? '';
         },
         get localizationKey() {
            return this.storage.langKey;
         },
         get amount() {
            return this.storage.amount;
         },
         set amount(v) {
            this.storage!.amount = v;
         },
         get lockMode() {
            return this.storage.lockMode;
         },
         set lockMode(v) {
            this.storage!.lockMode = v;
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

         setCanPlaceOn(blockIdentifiers) {
            this.storage.canPlaceOn = blockIdentifiers ?? [];
         },
         getCanPlaceOn() {
            return this.storage.canPlaceOn;
         },

         get isStackable() {
            if ((this as ItemStack).getDynamicPropertyIds().length !== 0) return false;
            if ((this as ItemStack).maxAmount > 0) return false;
            return true;
         },
      },
      true,
   );
}
ItemStackPlugin.register('itemStack');
