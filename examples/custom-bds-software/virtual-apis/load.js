// Load plugins
import '@bedrock-apis/core-plugin';
import './plugin.js';

// Configure
import { EventsPlugin, SystemPlugin } from '@bedrock-apis/core-plugin';
import { loadModules } from '@bedrock-apis/va-loader/node';
import { Context } from '@bedrock-apis/virtual-apis';
import { MyPlugin } from './plugin.js';

const context = new Context();

// Any plugins should be loaded before context configure
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

await loadModules(context);

// SCRIPT API CODE ENTRYPOINT SHOULD BE ASYNC
// because otherwise it will be hoisted on top
// and loaded when no plugins were enabled
import('../scripts/index.js');
