import { corePluginVanillaDataProvider } from '@bedrock-apis/va-core-plugin/dump/provider';
import { Context } from '@bedrock-apis/virtual-apis';
import { loadModules } from './index';
import { CorePlugin } from '@bedrock-apis/va-core-plugin';

const context = new Context();
context.setup({});
context.pluginManager.use(CorePlugin);
await loadModules(context, { providers: [corePluginVanillaDataProvider] });
