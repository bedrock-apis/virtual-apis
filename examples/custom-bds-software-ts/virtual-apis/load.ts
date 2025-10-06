// Load plugins
import '@bedrock-apis/va-core-plugin';
import './plugin.ts';

// Configure
import { CorePlugin } from '@bedrock-apis/va-core-plugin';
import { loadModules } from '@bedrock-apis/va-loader/node';
import { Context } from '@bedrock-apis/virtual-apis';
import { MyFeature } from './plugin.ts';

const context = new Context();
context.use(CorePlugin);

context.setup({
   implementationEarlyExit: true,
});

CorePlugin.registerFeature(MyFeature.setup({ myConfigProperty: 6 }));
context.use(CorePlugin);

context.ready();

await loadModules(context, {});

// SCRIPT API CODE ENTRYPOINT SHOULD BE ASYNC
// because otherwise it will be hoisted on top
// and loaded when no plugins were enabled
import('../scripts/index.ts');
