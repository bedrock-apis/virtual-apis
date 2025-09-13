import { MapWithDefaults } from '@bedrock-apis/common';
import { Plugin } from '@bedrock-apis/va-pluggable';
import { Impl, ImplStoraged } from '@bedrock-apis/va-pluggable/src/implementation';
import { Container, ContainerSlot, ItemStack } from '@minecraft/server';
import { ItemStackPlugin } from './item-stack';

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
      },
   );

   // We take storage and implementation of the ItemStack and apply them to the container slot
   protected _ = new (class ProxyImpl extends ImplStoraged<object, object> {
      public constructor(containerSlot: Impl) {
         const { module, className } = Impl.getModuleAndImpl(containerSlot);
         const itemPlugin = module.plugin.context.getPlugin(ItemStackPlugin, 'containerSlot');

         super(module, className, Impl.getModuleAndImpl(itemPlugin.itemStack).impl, () => ({}));
         this.storage = itemPlugin.itemStack.storage;
      }
   })(this.containerSlot);
}
InventoryPlugin.register('inventory');
