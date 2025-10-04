import { IndexedAccessor } from '@bedrock-apis/va-common';
import { ServerModuleTypeMap } from '@bedrock-apis/va-pluggable';
import type { ItemLockMode, RawMessage, RawText } from '@minecraft/server';
import { rawTextToString } from '../../../va-common/src/rawtext';
import { CorePlugin, va } from '../core-plugin';
import { corePluginVanillaDataProvider } from '../dump/provider';
import { DynamicProperties } from './dynamic-properties';

export class ItemType extends va.server.class('ItemType') {
   @va.getter('id') public id: string;
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
      super();
      this.id = id;
   }
}

export class ItemTypes extends va.server.class('ItemTypes') {
   public static types: ItemType[] = [];

   @va.static.method('getAll') public static getAll() {
      return this.types.map(e => va.asHandle(e));
   }

   @va.static.method('get') public static get(id: string) {
      id = CorePlugin.addNamespace(id);
      const result = this.types.find(e => e.id === id);
      return result ? va.asHandle(result) : result;
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
export class ItemStack extends va.server.class('ItemStack', DynamicProperties) {
   public constructor(identifier: string | ServerModuleTypeMap['ItemType']['prototype'], amount: number) {
      super();
      const typeId = typeof identifier === 'string' ? CorePlugin.addNamespace(identifier) : identifier.id;
      const type = ItemTypes.types.find(e => e.id === typeId);

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

   protected override dynamicPropertiesGuard = () => {
      if (this.maxAmount > 1) throw new Error('Dynamic properties are not supported');
   };

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
   @va.method('setLore') public setLore(lore: (string | RawText)[]) {
      this.lore = lore;
   }
}
