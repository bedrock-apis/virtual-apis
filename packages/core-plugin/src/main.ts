import { d } from '@bedrock-apis/common';
import { ConstructableSymbol, ContextPlugin, ModuleSymbol, PropertyGetterSymbol } from '@bedrock-apis/virtual-apis';

// export * from './events';

console.log('Core plugin imported');

class CoreTestPlugin extends ContextPlugin {
   protected storages = new Map<string, { impl?: unknown }>();
   public override onInitialization(): void {
      // TODO Actual storage/handle implementation

      this.implementSimpleGetter('World::afterEvents getter', 'WorldAfterEvents');
      this.implementSimpleGetter('WorldAfterEvents::buttonPush getter', 'ButtonPushAfterEventSignal');
   }

   public override onAfterModuleCompilation(module: ModuleSymbol): void {
      d('avx', module.name);
      if (module.name !== '@minecraft/server') return;

      const symbols = module.symbols;

      d('sym', symbols.size);

      for (const symbol of symbols) {
         if (symbol instanceof ConstructableSymbol) {
            for (const a of symbol.prototypeFields) {
               if (a instanceof PropertyGetterSymbol && a.returnType instanceof ConstructableSymbol) {
                  d(a.identifier, a.returnType.name);
               }
            }
         }
      }
   }

   private implementSimpleGetter(symbolName: string, instanceClassId: string) {
      this.context.implement(symbolName, ctx => {
         let storage = this.storages.get(ctx.symbol.identifier);
         if (!storage) this.storages.set(ctx.symbol.identifier, (storage = {}));

         if (!storage.impl) {
            const symbol = ctx.context.modules.get('@minecraft/server')?.symbolsMap.get(instanceClassId);
            if (!(symbol instanceof ConstructableSymbol)) throw new Error('Non constructable');

            storage.impl ??= symbol?.createRuntimeInstanceInternal(this.context);
         }

         ctx.result = storage.impl;
      });
   }
}
CoreTestPlugin.register('test');
