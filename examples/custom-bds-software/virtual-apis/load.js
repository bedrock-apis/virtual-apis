// CORE PLUGINS ENTRYPOINT
import '@bedrock-apis/virtual-apis/plugins/all';
import '@bedrock-apis/virtual-apis/plugins/inventory';
import '@bedrock-apis/virtual-apis/plugins/core';

// CUSTOM PLUGINS ENTRYPOINT
import './plugin.js';

// SCRIPT API CODE ENTRYPOINT
import '../scripts/index.js';
