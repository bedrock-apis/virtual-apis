// CORE PLUGINS ENTRYPOINT
import '@bedrock-apis/virtual-apis/plugins/all';

// CONFIGURE SEPARATE PLUGIN
import EventsPlugin from '@bedrock-apis/virtual-apis/plugins/events';

EventsPlugin.configure({
   warnIfEventIsNotImplemented: true,
});

// CUSTOM PLUGINS ENTRYPOINT
import './plugin.js';

// SCRIPT API CODE ENTRYPOINT
import '../scripts/index.js';
