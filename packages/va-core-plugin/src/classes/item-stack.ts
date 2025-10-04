import type { ItemLockMode } from '@minecraft/server';
import { va } from '../core-plugin';

export class ItemType extends va.server.class('ItemType') {
   @va.getter('id') public id: string;
   public constructor(id: string) {
      super();
      this.id = id;
   }
}

export class ItemStack extends va.server.class('ItemStack') {
   public constructor(type: ItemType, amount: number) {
      super();
      this.amount = amount;
      this.type = type;
      this.typeId = type.id;
      this.lockMode = 'none' as ItemLockMode; // TODO Somehow resolve it here and set
      this.maxAmount = 64; // todo pull data from source
   }

   @va.property('amount') public amount: number;
   @va.getter('type') public type: ItemType;
   @va.getter('typeId') public typeId: string;
   @va.property('lockMode') public lockMode: ItemLockMode;
   @va.getter('maxAmount') public maxAmount: number;
   @va.getter('isStackable') public get isStackable() {
      // if (this.getDynamicPropertyIds().length !== 0) return false; // TODO Way to call properties implemented in other places
      if (this.maxAmount > 0) return false;
      return true;
   }
}
