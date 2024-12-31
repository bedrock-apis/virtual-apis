import { Kernel } from '../api-builder/isolation/kernel';

export class Plugin extends Kernel.Empty {}

export abstract class PluginWithConfig<Config extends object> extends Plugin {
   public abstract config: Config;
   public configure(config: Config) {
      Kernel['globalThis::Object'].assign(this.config ?? {}, config);
   }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginStorage {}
