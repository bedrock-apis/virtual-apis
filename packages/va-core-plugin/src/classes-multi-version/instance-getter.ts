import { Plugin } from '@bedrock-apis/va-pluggable';
import {
   ConstructableSymbol,
   ContextPluginLinkedStorage,
   ModuleSymbol,
   PropertyGetterSymbol,
} from '@bedrock-apis/virtual-apis';

export class CoreInstanceGetterPlugin extends Plugin {
   public readonly ignoredInstanceClassIds = ['ItemStack', 'Player', 'Entity', 'Dimension', 'Block'];

   public storage = new ContextPluginLinkedStorage<{
      properties: Map<string, unknown>;
      parent?: WeakRef<object>;
   }>(() => ({ properties: new Map() }));

   public setInstanceGetValue(loaded: ModuleSymbol, symbolIdentifier: string, instance: object | (() => object)) {
      this.context.implement(loaded.nameVersion, symbolIdentifier, ctx => {
         if (!ctx.thisObject) throw new Error('Implementation requires thisObject to work');
         const storage = this.storage.get(ctx.thisObject);
         const key = ctx.symbol.identifier;
         let value = storage.properties.get(key);
         if (!value) storage.properties.set(key, (value = typeof instance === 'function' ? instance() : instance));

         ctx.result = value;
      });
   }

   protected _ = this.server.onLoad.subscribe((mod, versions) => {
      for (const module of versions) {
         for (const symbol of module.symbols.values()) {
            if (symbol instanceof ConstructableSymbol) {
               for (const property of symbol.prototypeFields.values()) {
                  if (property instanceof PropertyGetterSymbol && property.returnType instanceof ConstructableSymbol) {
                     const instanceClassId = property.returnType.name;

                     if (this.ignoredInstanceClassIds.includes(instanceClassId)) continue;

                     const identifier = property.identifier;
                     this.setInstanceGetValue(module, identifier, () => {
                        return mod.construct(instanceClassId as 'ItemStack');
                     });
                  }
               }
            }
         }
      }
   });
}
CoreInstanceGetterPlugin.register('instanceGetter');
