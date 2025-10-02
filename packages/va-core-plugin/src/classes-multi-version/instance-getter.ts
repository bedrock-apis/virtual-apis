import { PluginFeature } from '@bedrock-apis/va-pluggable';
import { ConstructableSymbol, InvocableSymbol, PropertyGetterSymbol } from '@bedrock-apis/virtual-apis';
import { CorePlugin } from '../core-plugin';

// TODO Fix. it uses global storage in the wrong way. Maybe creating local storage will be better
// TODO Fix. it will not work with multi-context

export class CoreInstanceGetterPlugin extends PluginFeature {
   public readonly ignoredInstanceClassIds = ['ItemStack', 'Player', 'Entity', 'Dimension', 'Block'];

   protected setInstanceGetValue(
      plugin: CorePlugin,
      symbol: InvocableSymbol<unknown>,
      instance: object | (() => object),
   ) {
      plugin.implement(symbol, ctx => {
         if (!ctx.thisObject) throw new Error('Implementation requires thisObject to work');

         const storage = plugin.getOrCreateStorage<{
            properties: Map<string, unknown>;
            parent?: WeakRef<object>;
         }>(ctx.thisObject, () => ({ properties: new Map() }));

         const key = ctx.symbol.identifier;
         let value = storage.properties.get(key);
         if (!value) storage.properties.set(key, (value = typeof instance === 'function' ? instance() : instance));

         ctx.result = value;
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
CorePlugin.registerDefaultFeature(CoreInstanceGetterPlugin);
