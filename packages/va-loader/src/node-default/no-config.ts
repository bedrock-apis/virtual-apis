import { Context } from '@bedrock-apis/virtual-apis';
import { loadModules } from './index';

const context = new Context();
context.setup({});
await loadModules(context);
