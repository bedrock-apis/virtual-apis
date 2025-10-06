import { IndexedAccessor, rawTextToString } from '@bedrock-apis/va-common';
import type { ItemLockMode, RawMessage, RawText } from '@minecraft/server';
import { CorePlugin } from '../core-plugin';
import { va } from '../decorators';
import { corePluginVanillaDataProvider } from '../dump/provider';
import { Components } from './components';
import { DynamicProperties } from './dynamic-properties';
import { BaseType } from './helpers';

export class ItemType extends va.server.class('ItemType', BaseType) {
   public constructor(
      id: string,
      public readonly data: {
         tags: string[];
         maxAmount: number;
         components: Record<string, unknown>;
         localizationKey: string;
         weight: number;
      },
   ) {
      super([id]);
   }
}

export class ItemTypes extends va.server.class('ItemTypes') {
   public static types: ItemType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.slice();
   }

   @va.static.method('get') public static get(id: string) {
      id = CorePlugin.addNamespace(id);
      return this.types.find(e => e.id === id);
   }
}

corePluginVanillaDataProvider.onRead.subscribe(({ items }) => {
   const tagsAcc = new IndexedAccessor(items.tags);
   const compAcc = new IndexedAccessor(items.components);
   for (const [typeId, item] of Object.entries(items.items)) {
      ItemTypes.types.push(
         new ItemType(typeId, {
            ...item,
            tags: item.tags.map(e => tagsAcc.fromIndex(e)),
            components: Object.fromEntries(item.components.map(e => compAcc.fromIndex(e)).map(e => [e.typeId, e.data])),
         }),
      );
   }
});

@va.constructable()
export class ItemStack extends va.server.class('ItemStack', DynamicProperties, Components) {
   public constructor(identifier: string | ItemType, amount: number) {
      super([], []);
      const typeId = typeof identifier === 'string' ? CorePlugin.addNamespace(identifier) : identifier.id;
      const type = identifier instanceof ItemType ? identifier : ItemTypes.types.find(e => e.id === typeId);

      if (!type) throw new Error(`Invalid item identifier '${identifier}'.`);

      this.amount = amount;
      this.type = type;
      this.typeId = type.id;

      this.lockMode = 'none' as ItemLockMode; // TODO Somehow resolve it here and set
      this.maxAmount = type.data.maxAmount;
      this.weight = type.data.weight;
      this.localizationKey = type.data.localizationKey;
      this.tags = type.data.tags;
   }

   protected override dynamicPropertiesGuard() {
      if (this.maxAmount > 1) throw new Error('Dynamic properties are not supported');
   }

   public override isValid = true;

   @va.property('amount') public amount: number;
   @va.getter('type') public type: ItemType;
   @va.getter('typeId') public typeId: string;
   @va.property('lockMode') public lockMode: ItemLockMode;
   @va.getter('maxAmount') public maxAmount: number;
   @va.getter('weight') public weight: number;
   @va.getter('localizationKey') public localizationKey: string;
   @va.getter('isStackable') public get isStackable() {
      if (this.getDynamicPropertyIds().length !== 0) return false;
      if (this.maxAmount > 0) return false;
      return true;
   }

   protected tags: string[];

   @va.method('getTags') public getTags() {
      return this.tags.slice();
   }
   @va.method('hasTag') public hasTag(tag: string) {
      return this.tags.includes(tag);
   }

   public lore: (string | RawText)[] = [];
   @va.method('getLore') public getLore() {
      return this.lore.map(e => (typeof e === 'string' ? e : rawTextToString(e, 'en_US')));
   }
   @va.method('getRawLore') public getRawLore() {
      return this.lore.slice() as RawMessage[]; // its fixed in latest types so
   }
   @va.method('setLore') public setLore(lore: undefined | (string | RawMessage)[]) {
      this.lore = lore ?? [];
   }

   @va.method('getComponents') public override getComponents() {
      return super.getComponents();
   }

   protected canPlaceOn: string[] = [];

   @va.method('getCanPlaceOn') public getPlaceOn() {
      return this.canPlaceOn;
   }

   @va.method('setCanPlaceOn') public setCanPlaceOn(v: string[]) {
      this.canPlaceOn = v.slice();
   }

   protected canDestroy: string[] = [];

   @va.method('setCanDestroy') public setCanDestroy(v: string[]) {
      this.canDestroy = v.slice();
   }

   @va.method('getCanDestroy') public getCanDestroy() {
      return this.canDestroy;
   }

   @va.method('clone') public clone() {
      return structuredClone(this) as ItemStack;
   }
}

export class ContainerSlot extends va.server.class('ContainerSlot') {
   public item?: ItemStack;

   public constructor(item?: ItemStack) {
      super();
      this.item = item;
   }

   @va.method('getItem') public getItem() {
      // Don't allow them to modify item
      return this.item?.clone();
   }

   @va.method('setItem') public setItem(item?: ItemStack) {
      // Item stack is auto converted
      this.item = item?.clone();
   }
}
