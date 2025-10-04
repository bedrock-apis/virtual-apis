import { Context, ContextPlugin, d, VaEventLoader } from '@bedrock-apis/virtual-apis';
import { PluginFeature } from './feature';
import { generatedModules, GeneratedModuleTypes, withGeneratedModules } from './main';
import { PluginModule } from './module';

export abstract class Pluggable extends withGeneratedModules<
   { [K in keyof GeneratedModuleTypes]: PluginModule<GeneratedModuleTypes[K]> },
   typeof ContextPlugin
>(ContextPlugin) {
   protected static features: PluginFeature[] = [];

   public constructor(context: Context) {
      super(context);

      for (const [key, [id, version]] of Object.entries(generatedModules)) {
         (this as unknown as Record<string, PluginModule>)[key] = new PluginModule(this, id, version as '0.0.0');
      }
   }

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
}
