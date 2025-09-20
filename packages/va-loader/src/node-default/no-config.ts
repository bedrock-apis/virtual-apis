import { corePluginVanillaDataProvider } from '@bedrock-apis/va-core-plugin/dump/provider';
import { Context } from '@bedrock-apis/virtual-apis';
import { loadModules } from './index';

const context = new Context();
context.setup({});
await loadModules(context, { providers: [corePluginVanillaDataProvider] });
context.ready();
