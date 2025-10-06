// Load plugins
import '@bedrock-apis/va-core-plugin';
import './plugin';

// Configure
import { CorePlugin } from '@bedrock-apis/va-core-plugin';
import { context } from '@bedrock-apis/va-loader/vitest';
import { MyFeature } from './plugin';

context.setup({
   implementationEarlyExit: true,
});

CorePlugin.registerFeature(MyFeature.setup({ myConfigProperty: 6 }));
context.use(CorePlugin);

context.ready();

// SCRIPT API CODE IS LOADED BY VITEST
