import { Plugin, ServerModuleTypeMap } from '@bedrock-apis/va-pluggable';

class InventoryPlugin extends Plugin {
   protected id = 'inventory';

   public inventory = this.serverBeta.implementWithStorage(
      'EntityInventoryComponent',
      () => ({ container: undefined as undefined | ServerModuleTypeMap['Container'] }),
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

   public container = this.serverBeta.implementWithStorage(
      'Container',
      () => new Map<number, InstanceType<ServerModuleTypeMap['ItemStack']>>(),
      {
         getItem(slot) {
            return this.storage.get(slot);
         },
         // @ts-expect-error Way to do new ContainerSlot?
         getSlot(slot) {
            return;
         },
         addItem(item) {
            this.storage.set(this.storage.size, item);
            return item;
         },
      },
   );
}

InventoryPlugin.register('inventory');
