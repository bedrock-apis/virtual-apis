import { Plugin } from '@bedrock-apis/va-pluggable';
import { ServerModuleTypeMap, StorageThis } from '@bedrock-apis/va-pluggable/src/types';
import type { Entity, ItemStack, Player, Vector3, World } from '@minecraft/server';

type Storage = Map<string, string | number | boolean | Vector3 | undefined>;
type This = StorageThis<Entity | ItemStack | Player | World, DynamicPropertiesPlugin, ServerModuleTypeMap, Storage>;

export class DynamicPropertiesPlugin extends Plugin {
   public implementDynamicProperties(
      target: 'World' | 'Entity' | 'Player' | 'ItemStack',
      guard?: (native: This) => void,
   ) {
      return this.server.implementWithStorage(target, () => new Map() as Storage, {
         getDynamicProperty(identifier) {
            guard?.(this);
            return this.storage.get(identifier);
         },
         getDynamicPropertyIds() {
            guard?.(this);
            return [...this.storage.keys()];
         },
         getDynamicPropertyTotalByteCount() {
            guard?.(this);
            let s = 0;
            for (const [k, v] of this.storage.entries()) {
               s += k.length;
               s += JSON.stringify(v).length;
            }
            return s;
         },
         setDynamicProperties(values) {
            guard?.(this);
            for (const [prop, val] of Object.entries(values)) {
               this.storage.set(prop, val);
            }
         },
         setDynamicProperty(identifier, value) {
            guard?.(this);
            this.storage.set(identifier, value);
         },
         clearDynamicProperties() {
            guard?.(this);
            this.storage.clear();
         },
      });
   }

   public world = this.implementDynamicProperties('World');
   public entity = this.implementDynamicProperties('Entity');
   public player = this.implementDynamicProperties('Player');
   public item = this.implementDynamicProperties('ItemStack', ctx => {
      if ((ctx.instance as ItemStack).maxAmount > 1) throw new Error('Dynamic props are not supported');
   });
}
DynamicPropertiesPlugin.register('dynamicProperties');
