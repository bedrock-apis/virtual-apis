import { Plugin } from '@bedrock-apis/va-pluggable';
import type { Vector3 } from '@minecraft/server';

export class DynamicPropertiesPlugin extends Plugin {
   public implementDynamicProperties(target: 'World' | 'Entity' | 'Player') {
      this.serverBeta.implementWithStorage(
         target,
         () => new Map<string, string | number | boolean | Vector3 | undefined>(),
         {
            getDynamicProperty(identifier) {
               return this.storage.get(identifier);
            },
            getDynamicPropertyIds() {
               return [...this.storage.keys()];
            },
            getDynamicPropertyTotalByteCount() {
               let s = 0;
               for (const [k, v] of this.storage.entries()) {
                  s += k.length;
                  s += JSON.stringify(v).length;
               }
               return s;
            },
            setDynamicProperties(values) {
               for (const [prop, val] of Object.entries(values)) {
                  this.storage.set(prop, val);
               }
            },
            setDynamicProperty(identifier, value) {
               this.storage.set(identifier, value);
            },
            clearDynamicProperties() {
               this.storage.clear();
            },
         },
      );
   }

   public world = this.implementDynamicProperties('World');
   public entity = this.implementDynamicProperties('Entity');
   public player = this.implementDynamicProperties('Player');
}
DynamicPropertiesPlugin.register('dynamicProperties');
