import { d } from '@bedrock-apis/va-common/node';
import { Context, ContextPlugin, VaEventLoader } from '@bedrock-apis/virtual-apis';
import { PluginFeature } from './feature';
import { generatedModules, GeneratedModuleTypes, withGeneratedModules } from './main';
import { PluginModule } from './module';

export abstract class Pluggable extends withGeneratedModules<
   { [K in keyof GeneratedModuleTypes]: PluginModule<GeneratedModuleTypes[K]> },
   typeof ContextPlugin
>(ContextPlugin) {
   protected static features: (typeof PluginFeature)[] = [];

   public constructor(context: Context) {
      super(context);

      for (const [key, [id, version]] of Object.entries(generatedModules)) {
         (this as unknown as Record<string, PluginModule>)[key] = new PluginModule(this, id, version as '0.0.0');
      }
   }

   public static registerFeature(feature: typeof PluginFeature) {
      this.features.push(feature);
   }

   public getFeature<T extends typeof PluginFeature>(t: T) {
      const feature = this.features.find(e => e instanceof t);
      if (!feature) throw new Error('no feature');
      return feature as InstanceType<T>;
   }

   protected features: PluginFeature[] = [];

   public override onRegistration(): void {
      for (const featureCreator of Pluggable.features) {
         const feature = new featureCreator();
         feature.onCreate(this);
         this.features.push(feature);
      }
   }

   public override onAfterReady(): void {
      d('pluggable onAfterReady');
      for (const feature of this.features) feature.onReady(this);
      this.onAfterReadyEvent.invoke();
   }

   public onAfterReadyEvent = new VaEventLoader();
}
