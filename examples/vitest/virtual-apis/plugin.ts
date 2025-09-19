import { PluginWithConfig } from '@bedrock-apis/va-pluggable';

interface Config {
   myConfigProperty: number;
}

export class MyPlugin extends PluginWithConfig<Config> {
   protected config: Config = {
      myConfigProperty: 4,
   };

   protected _ = this.server.implement('World', {
      getDay() {
         return this.plugin.config.myConfigProperty;
      },
   });
}
MyPlugin.register('myPlugin');
