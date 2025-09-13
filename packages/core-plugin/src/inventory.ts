import { MapWithDefaults } from '@bedrock-apis/common';
import { Plugin } from '@bedrock-apis/va-pluggable';
import { Container, ContainerSlot, ItemStack } from '@minecraft/server';

class InventoryPlugin extends Plugin {
   protected id = 'inventory';

   public inventory = this.server.implementWithStorage(
      'EntityInventoryComponent',
      () => ({ container: undefined as undefined | Container }),
      {
         get canBeSiphonedFrom() {
            return true;
         },
         get containerType() {
            return 'type';
         },
         get container() {
            return this.container;
         },
      },
   );

   public container = this.server.implementWithStorage(
      'Container',
      () => ({ items: new Map<number, ItemStack>(), slots: new MapWithDefaults<number, ContainerSlot>() }),
      {
         getItem(slot) {
            return this.storage.items.get(slot);
         },
         getSlot(slotIndex) {
            return this.storage.slots.getOrCreate(slotIndex, () =>
               this.plugin.containerSlot.create({ item: this.storage.items.get(slotIndex) }),
            );
         },
         addItem(item) {
            this.storage.items.set(this.storage.items.size, item);
            return item;
         },
      },
   );

   public containerSlot = this.server.implementWithStorage(
      'ContainerSlot',
      () => ({ item: undefined as undefined | ItemStack }),
      {
         getItem() {
            return this.storage.item;
         },
         setItem(item) {
            this.storage.item = item;
         },
         // Find a way to redirect calls more efficiently
         getCanDestroy() {
            return this.storage.item?.getCanDestroy() ?? [];
         },
         getCanPlaceOn() {
            return this.storage.item?.getCanPlaceOn() ?? [];
         },
         getTags() {
            return this.storage.item?.getTags() ?? [];
         },
         isStackableWith(itemStack) {
            return this.storage.item?.isStackableWith(itemStack) ?? false;
         },
         get isStackable() {
            return this.storage.item.isStackable;
         },
      },
   );
}
InventoryPlugin.register('inventory');
