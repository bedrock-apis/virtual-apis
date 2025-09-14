import { ContextPlugin } from './plugin';

export interface ContextConfig {
   implementationEarlyExit: boolean;
   disablePlugins: (typeof ContextPlugin)[];
}
