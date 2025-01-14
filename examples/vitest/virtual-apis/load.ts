// VIRTUAL APIS CONFIG
import { configure } from '@bedrock-apis/virtual-apis';

configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

// CORE PLUGINS ENTRYPOINT
import '@bedrock-apis/virtual-apis/plugins/all';

// CONFIGURE CORE PLUGIN
import EventsPlugin from '@bedrock-apis/virtual-apis/plugins/events';

EventsPlugin.configure({
   warnIfEventIsNotImplemented: true,
});

// CUSTOM PLUGINS ENTRYPOINT
import './plugin';

// SCRIPT API CODE IS LOADED BY VITEST
