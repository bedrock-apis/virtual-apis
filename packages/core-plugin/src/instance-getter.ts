import { d } from '@bedrock-apis/common';
import {
   ConstructableSymbol,
   ContextPlugin,
   ContextPluginLinkedStorage,
   ModuleSymbol,
   PropertyGetterSymbol,
} from '@bedrock-apis/virtual-apis';

export class CoreInstanceGetterPlugin extends ContextPlugin {
   public override onInitialization(): void {}

   public override onAfterModuleCompilation(module: ModuleSymbol): void {
      d('AA', module.name);
      if (module.name !== '@minecraft/server') return;

      const symbols = module.symbols;

      for (const symbol of symbols) {
         if (symbol instanceof ConstructableSymbol) {
            for (const property of symbol.prototypeFields.values()) {
               if (property instanceof PropertyGetterSymbol && property.returnType instanceof ConstructableSymbol) {
                  const instanceClassId = property.returnType.name;

                  if (this.ignoredInstanceClassIds.includes(instanceClassId)) continue;

                  const identifier = property.identifier;
                  this.implementInstanceGetter(identifier, instanceClassId);
               }
            }
         }
      }
   }

   public readonly ignoredInstanceClassIds = ['ItemStack', 'Player', 'Entity', 'Dimension', 'Block'];

   public storage = new ContextPluginLinkedStorage<{
      properties: Map<string, unknown>;
      parent?: WeakRef<object>;
   }>(() => ({ properties: new Map() }));

   public setInstanceGetValue(symbolIdentifier: string, instance: object | (() => object)) {
      this.context.implement(symbolIdentifier, ctx => {
         if (!ctx.thisObject) throw new Error('Implementation requires thisObject to work');
         const storage = this.storage.get(ctx.thisObject);
         const key = ctx.symbol.identifier;
         let value = storage.properties.get(key);
         if (!value) storage.properties.set(key, (value = typeof instance === 'function' ? instance() : instance));

         ctx.result = value;
      });
   }

   private implementInstanceGetter(symbolIdentifier: string, instanceClassId: string) {
      this.setInstanceGetValue(symbolIdentifier, () => {
         const symbol = this.context.modules.get('@minecraft/server')?.symbolsMap.get(instanceClassId);
         if (!(symbol instanceof ConstructableSymbol)) throw new Error('Non constructable');

         return symbol?.createRuntimeInstanceInternal(this.context);
      });
   }
}
CoreInstanceGetterPlugin.register('instanceGetter');
