import { ModuleTypeMap, Plugin } from '@bedrock-apis/va-pluggable';

class InventoryPlugin extends Plugin {
   protected id = 'inventory';

   public inventory = this.implementWithStorage(
      'EntityInventoryComponent',
      'inventory',
      () => ({ container: undefined as undefined | ModuleTypeMap['Container'] }),
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

   public container = this.implementWithStorage(
      'Container',
      'container',
      () => new Map<number, InstanceType<ModuleTypeMap['ItemStack']>>(),
      {
         getItem(slot) {
            return this.STORAGE.get(slot);
         },
         // @ts-expect-error Way to do new ContainerSlot?
         getSlot(slot) {
            return;
         },
         addItem(item) {
            this.STORAGE.set(this.STORAGE.size, item);
            return item;
         },
      },
   );
}

export default new InventoryPlugin();
