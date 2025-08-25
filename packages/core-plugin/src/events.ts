import { PluginWithConfig } from '@bedrock-apis/va-pluggable';

interface Config {
   warnIfEventIsNotImplemented: boolean;
}

export class EventsPlugin extends PluginWithConfig<Config> {
   public id = 'events';

   protected config: Config = {
      warnIfEventIsNotImplemented: true,
   };

   public events = new Map<string, (...args: unknown[]) => unknown>();

   public trigger(event: string, ...args: unknown[]) {}
}
