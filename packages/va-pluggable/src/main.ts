import { ContextPlugin, VaEventLoader } from '@bedrock-apis/virtual-apis';
import { PluginModule } from './module';
import { ServerModuleTypeMap } from './types';

export class PluginFeature {
   public onCreate(plugin: Pluggable) {}

   public onReady(plugin: Pluggable) {}
}

export abstract class Pluggable extends ContextPlugin {
   protected static features: PluginFeature[] = [];

   public static registerFeature(feature: PluginFeature) {
      this.features.push(feature);
   }

   public override onRegistration(): void {
      for (const feature of Pluggable.features) feature.onCreate(this);
   }

   public override onAfterReady(): void {
      for (const feature of Pluggable.features) feature.onReady(this);
      this.onAfterReadyEvent.invoke();
   }

   public server = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server');

   public server_v2_0_0 = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server', '2.0.0');

   public server_v1_17_0 = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server', '1.17.0', '2.0.0');

   public onAfterReadyEvent = new VaEventLoader();
}
