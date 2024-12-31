import { Kernel } from '../api-builder';
import { PluginWithConfig } from '../plugin-api/api';

interface Config {
   warnIfEventIsNotImplemented: boolean;
}

class EventsPlugin extends PluginWithConfig<Config> {
   public id = 'events';

   protected config: Config = {
      warnIfEventIsNotImplemented: true,
   };

   public events = new Kernel['globalThis::Map']<string, (...args: unknown[]) => unknown>();

   public trigger(event: string, ...args: unknown[]) {}
}

export default new EventsPlugin();
