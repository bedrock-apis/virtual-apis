import { VirtualPrivilege } from '@bedrock-apis/va-common';
import { PluginFeature } from '@bedrock-apis/va-pluggable';
import { CorePlugin } from '../core-plugin';
import { EventsFeature } from './events';

export class EarlyExecutionPlugin extends PluginFeature {
   public override onReady(plugin: CorePlugin): void {
      plugin.server_v2_0.onLoad.subscribe(mod => {
         plugin.context.currentPrivilege = VirtualPrivilege.EarlyExecution;
         const worldLoad = plugin.getFeature(EventsFeature).createTrigger(plugin, mod, 'worldAfter', 'worldLoad');
         const startup = plugin.getFeature(EventsFeature).createTrigger(plugin, mod, 'systemBefore', 'startup');

         setTimeout(() => {
            startup({
               blockComponentRegistry: blockComponentRegistry.create({}),

               // Beta, does not always exist
               customCommandRegistry: customCommandRegistry.tryCreate({})!,
               itemComponentRegistry: itemComponentRegistry.create({}),
            });
            plugin.context.currentPrivilege = VirtualPrivilege.None;
            worldLoad({});
         }, 1000);
      });

      const blockComponentRegistry = plugin.server_v2_0.implementWithStorage('BlockComponentRegistry', () => ({}), {
         registerCustomComponent(name, customComponent) {},
      });

      const customCommandRegistry = plugin.server_v2_0.implementWithStorage('CustomCommandRegistry', () => ({}), {
         registerEnum(name, values) {},
         registerCommand(customCommand, callback) {},
      });

      const itemComponentRegistry = plugin.server_v2_0.implementWithStorage('ItemComponentRegistry', () => ({}), {
         registerCustomComponent(name, itemCustomComponent) {},
      });
   }
}
CorePlugin.registerFeature(EarlyExecutionPlugin);
