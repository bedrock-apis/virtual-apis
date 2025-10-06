import { Pluggable, PluginFeature } from '@bedrock-apis/va-pluggable';

interface Config {
   myConfigProperty: number;
}

export class MyFeature extends PluginFeature {
   public static config: Config = {
      myConfigProperty: 4,
   };

   public onReady(plugin: Pluggable) {
      plugin.server.implement('World', {
         getDay() {
            return MyFeature.config.myConfigProperty;
         },
      });
   }
}
