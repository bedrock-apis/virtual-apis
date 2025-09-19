import { PluginWithConfig } from '@bedrock-apis/va-pluggable';

/** @typedef {myConfigProperty: number} Config */

/** @extends {PluginWithConfig<Config>} */
export class MyPlugin extends PluginWithConfig {
   _ = this.server.implement('World', {
      getDay() {
         return this.plugin.config.myConfigProperty;
      },
   });
}
MyPlugin.register('myPlugin');
