// Load plugins
import '@bedrock-apis/va-core-plugin';
import './plugin.ts';

// Configure
import { CorePlugin } from '@bedrock-apis/va-core-plugin';
import { Context } from '@bedrock-apis/virtual-apis';

const context = new Context();
context.pluginManager.use(CorePlugin);

// Any plugins should be loaded before context configure
/*
context.configureAndLoadPlugins({
   implementationEarlyExit: true,
   disablePlugins: [SystemPlugin],
});

context.getPlugin(EventsPlugin).configure({
   warnIfEventIsNotImplemented: true,
});

context.getPlugin(MyPlugin).configure({
   myConfigProperty: 6,
});

await loadModules(context);*/

// SCRIPT API CODE ENTRYPOINT SHOULD BE ASYNC
// because otherwise it will be hoisted on top
// and loaded when no plugins were enabled
import('../scripts/index.ts');
