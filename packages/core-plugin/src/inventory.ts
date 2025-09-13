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
            const slot = this.storage.slots.getOrCreate(slotIndex, () => this.module.construct('ContainerSlot'));
            const slotStorage = this.plugin.containerSlot.getStorage(slot);
            slotStorage.item = this.storage.items.get(slotIndex);

            return slot;
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
      },
   );
}
InventoryPlugin.register('inventory');
