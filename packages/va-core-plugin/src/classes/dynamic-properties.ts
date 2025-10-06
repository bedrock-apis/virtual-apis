import type { Vector3 } from '@minecraft/server';
import { va } from '../decorators';

type DynamicPropertyValue = string | number | boolean | Vector3;

export class DynamicProperties extends va.server.base(['World', 'Entity', 'ItemStack']) {
   private dynamicPropertiesStorage = new Map<string, DynamicPropertyValue>();

   protected dynamicPropertiesGuard?(): void;

   @va.method('getDynamicProperty')
   public getDynamicProperty(identifier: string) {
      this.dynamicPropertiesGuard?.();
      return this.dynamicPropertiesStorage.get(identifier);
   }

   @va.method('getDynamicPropertyIds')
   public getDynamicPropertyIds() {
      this.dynamicPropertiesGuard?.();
      return [...this.dynamicPropertiesStorage.keys()];
   }

   @va.method('getDynamicPropertyTotalByteCount')
   public getDynamicPropertyTotalByteCount() {
      this.dynamicPropertiesGuard?.();

      let s = 0;
      for (const [k, v] of this.dynamicPropertiesStorage.entries()) {
         s += k.length;
         s += JSON.stringify(v).length;
      }
      return s;
   }

   @va.method('setDynamicProperties')
   public setDynamicProperties(values: Record<string, DynamicPropertyValue>) {
      this.dynamicPropertiesGuard?.();
      for (const [prop, val] of Object.entries(values)) this.dynamicPropertiesStorage.set(prop, val);
   }

   @va.method('setDynamicProperty')
   public setDynamicProperty(identifier: string, value: DynamicPropertyValue) {
      this.dynamicPropertiesGuard?.();
      this.dynamicPropertiesStorage.set(identifier, value);
   }

   @va.method('clearDynamicProperties')
   public clearDynamicProperties() {
      this.dynamicPropertiesGuard?.();
      this.dynamicPropertiesStorage.clear();
   }
}
