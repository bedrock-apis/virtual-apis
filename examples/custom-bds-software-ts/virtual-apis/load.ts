// VIRTUAL APIS CONFIG
import { Context } from '@bedrock-apis/virtual-apis';

Context.Configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

// CORE PLUGINS ENTRYPOINT
import '@bedrock-apis/core-plugin';

// CONFIGURE CORE PLUGIN
import { EventsPlugin } from '@bedrock-apis/core-plugin';

new EventsPlugin().configure({
   warnIfEventIsNotImplemented: true,
});

// CUSTOM PLUGINS ENTRYPOINT
import './plugin';

// SCRIPT API CODE ENTRYPOINT
import '../scripts/index';
