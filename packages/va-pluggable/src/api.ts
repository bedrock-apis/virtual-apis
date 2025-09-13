import { ContextPlugin, ContextPluginLinkedStorage, ModuleSymbol } from '@bedrock-apis/virtual-apis';
import { PluginModule } from './module';
import { ServerModuleTypeMap } from './types';

export abstract class Plugin extends ContextPlugin {
   protected onWarning(warning: unknown) {}
   protected onError(error: unknown) {}
   protected onPanic(panic: unknown) {}

   public modules = new Set<PluginModule>();

   protected server = new PluginModule<ServerModuleTypeMap, this>(this, '@minecraft/server');

   protected server_below_v2_0_0 = new PluginModule<ServerModuleTypeMap, this>(
      this,
      '@minecraft/server',
      undefined,
      '2.0.0',
   );

   protected server_below_v1_17_0 = new PluginModule<ServerModuleTypeMap, this>(
      this,
      '@minecraft/server',
      undefined,
      '1.17.0',
   );

   protected getStorage<T extends object = object>(instance: object, storage: ContextPluginLinkedStorage<T>): T {
      return storage.get(instance);
   }

   public override onAfterModuleCompilation(symbol: ModuleSymbol): void {
      for (const module of this.modules.values()) module.onAfterModuleCompilation(symbol);
   }

   public override onModulesLoaded(): void {
      for (const module of this.modules.values()) module.onModulesLoaded();
   }

   protected getPlugin(plugin: typeof ContextPlugin) {
      this.context.getPlugin(plugin);
   }
}

export abstract class PluginWithConfig<Config extends object> extends Plugin {
   protected abstract config: Config;
   public configure(config: Config) {
      Object.assign(this.config ?? {}, config);
   }
}
