import { ContextPluginLinkedStorage, PluginFeature } from '@bedrock-apis/va-pluggable';
import {
   ConstructableSymbol,
   InvocableSymbol,
   MapWithDefaults,
   PropertyGetterSymbol,
} from '@bedrock-apis/virtual-apis';
import { CorePlugin } from '../core-plugin';

export class CoreInstanceGetterPlugin extends PluginFeature {
   public readonly ignoredInstanceClassIds = ['ItemStack', 'Player', 'Entity', 'Dimension', 'Block'];

   protected storage = new ContextPluginLinkedStorage<{
      properties: MapWithDefaults<string, unknown>;
      parent?: WeakRef<object>;
   }>(() => ({ properties: new MapWithDefaults() }));

   protected setInstanceGetValue(plugin: CorePlugin, symbol: InvocableSymbol<unknown>, instance: () => object) {
      plugin.registerCallback(symbol, ctx => {
         if (!ctx.thisObject) throw new Error('Implementation requires thisObject to work');

         ctx.result = this.storage
            .get(ctx.thisObject, ctx.context)
            .properties.getOrCreate(ctx.symbol.identifier, instance);
      });
   }

   public override onReady(plugin: CorePlugin): void {
      plugin.server.onLoad.subscribe((mod, module) => {
         for (const symbol of module.symbols.values()) {
            if (symbol instanceof ConstructableSymbol) {
               for (const property of symbol.prototypeFields.values()) {
                  if (property instanceof PropertyGetterSymbol && property.returnType instanceof ConstructableSymbol) {
                     const instanceClassId = property.returnType.name;

                     if (this.ignoredInstanceClassIds.includes(instanceClassId)) continue;

                     this.setInstanceGetValue(plugin, property, () => {
                        return mod.construct(instanceClassId as 'ItemStack');
                     });
                  }
               }
            }
         }
      });
   }
}
CorePlugin.registerFeature(CoreInstanceGetterPlugin);
