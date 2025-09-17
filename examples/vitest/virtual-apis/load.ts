// Load plugins
import '@bedrock-apis/va-core-plugin';
import './plugin';

// Configure
import { EventsPlugin, SystemPlugin } from '@bedrock-apis/va-core-plugin';
import { context } from '@bedrock-apis/va-loader/vitest';
import { MyPlugin } from './plugin';

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

// SCRIPT API CODE IS LOADED BY VITEST
