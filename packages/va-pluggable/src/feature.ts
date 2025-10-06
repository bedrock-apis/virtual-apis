import { VaEventEmitter } from '@bedrock-apis/va-common';
import { Pluggable } from './pluggable';

export class PluginFeature {
   public onCreate(plugin: Pluggable) {}

   public onReady(plugin: Pluggable) {
      this.onReadyEvent.invoke(plugin);
   }

   public onReadyEvent = new VaEventEmitter<[Pluggable]>();

   public static setup<T extends { config: object }>(this: T, config: Partial<T['config']>): T {
      Object.assign(this.config, config);
      return this;
   }
}
