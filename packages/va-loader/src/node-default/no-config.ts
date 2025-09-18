import { Context } from '@bedrock-apis/virtual-apis';
import { loadModules } from './index';

const context = new Context();
context.configureAndLoadPlugins({});
await loadModules(context);
