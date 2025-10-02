import { ContextPlugin, d, VaEventLoader } from '@bedrock-apis/virtual-apis';
import { PluginModule } from './module';
import { ServerModuleTypeMap } from './types';

export class PluginFeature {
   public onCreate(plugin: Pluggable) {}

   public onReady(plugin: Pluggable) {}
}

export class PluginFeatureWithConfig<T extends object> extends PluginFeature {}

export abstract class Pluggable extends ContextPlugin {
   protected static features: PluginFeature[] = [];

   public static registerFeature(feature: PluginFeature) {
      this.features.push(feature);
   }

   public getFeature<T extends typeof PluginFeature>(t: T) {
      const feature = Pluggable.features.find(e => e instanceof t);
      if (!feature) throw new Error('no feature');
      return feature as InstanceType<T>;
   }

   public override onRegistration(): void {
      for (const feature of Pluggable.features) feature.onCreate(this);
   }

   public override onAfterReady(): void {
      d('pluggable onAfterReady');
      for (const feature of Pluggable.features) feature.onReady(this);
      this.onAfterReadyEvent.invoke();
   }

   public onAfterReadyEvent = new VaEventLoader();

   public server = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server');

   public server_v2_0_0 = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server', '2.0.0');

   public server_v1_17_0 = new PluginModule<ServerModuleTypeMap>(this, '@minecraft/server', '1.17.0', '2.0.0');
}
