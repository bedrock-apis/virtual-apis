import { PluginWithConfig } from '../plugin-api/api';

declare module '../plugin-api/api' {
   interface PluginStorage {
      events: {
         eventsList: Map<string, (...args: unknown[]) => unknown>;
         trigger(event: string, ...args: unknown[]): unknown;
      };
   }
}

interface Config {
   warnIfEventIsNotImplemented: boolean;
}

class EventsPlugin extends PluginWithConfig<Config> {
   public config: Config = {
      warnIfEventIsNotImplemented: true,
   };
}

export default new EventsPlugin();
