import { VirtualPrivilege } from '@bedrock-apis/va-binary';
import { Plugin } from '@bedrock-apis/va-pluggable';
import { EventsPlugin } from './events';

export class EarlyExecutionPlugin extends Plugin {
   protected _ = this.server_above_v2_0_0.onLoad.subscribe(mod => {
      this.context.currentPrivilege = VirtualPrivilege.EarlyExecution;
      const worldLoad = this.getPlugin(EventsPlugin).createTrigger(mod, 'worldAfter', 'worldLoad');
      const startup = this.getPlugin(EventsPlugin).createTrigger(mod, 'systemBefore', 'startup');

      setTimeout(() => {
         startup({
            blockComponentRegistry: this.blockComponentRegistry.create({}),

            // Beta, does not always exist
            customCommandRegistry: this.customCommandRegistry.tryCreate({})!,
            itemComponentRegistry: this.itemComponentRegistry.create({}),
         });
         this.context.currentPrivilege = VirtualPrivilege.None;
         worldLoad({});
      }, 1000);
   });

   protected blockComponentRegistry = this.server_above_v2_0_0.implementWithStorage(
      'BlockComponentRegistry',
      () => ({}),
      {
         registerCustomComponent(name, customComponent) {},
      },
   );

   protected customCommandRegistry = this.server_above_v2_0_0.implementWithStorage(
      'CustomCommandRegistry',
      () => ({}),
      {
         registerEnum(name, values) {},
         registerCommand(customCommand, callback) {},
      },
   );

   protected itemComponentRegistry = this.server_above_v2_0_0.implementWithStorage(
      'ItemComponentRegistry',
      () => ({}),
      {
         registerCustomComponent(name, itemCustomComponent) {},
      },
   );
}
EarlyExecutionPlugin.register('earlyExecution');
