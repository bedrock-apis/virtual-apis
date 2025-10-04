import { VaEventEmitter } from '@bedrock-apis/va-common';
import { Pluggable } from './pluggable';

export class PluginFeature {
   public onCreate(plugin: Pluggable) {}

   public onReady(plugin: Pluggable) {
      this.onReadyEvent.invoke(plugin);
   }

   public onReadyEvent = new VaEventEmitter<[Pluggable]>();
}

export class PluginFeatureWithConfig<T extends object> extends PluginFeature {}
