import { CorePlugin } from '@bedrock-apis/va-core-plugin';
import { corePluginVanillaDataProvider } from '@bedrock-apis/va-core-plugin/dump/provider';
import { Context } from '@bedrock-apis/virtual-apis';
import { loadModules } from './index';

const context = new Context();
context.setup({});
context.plugin.use(CorePlugin);
await loadModules(context, { providers: [corePluginVanillaDataProvider] });
