import type { ContextConfig } from './context/context-config';

import { Context } from './context';
export { Kernel } from './isolation/kernel';

export { ConfigContextOptions } from './context';
export { ClassDefinition } from './context/class-definition';

export * as APIPlugin from '../plugin/apis';
export * as APIFactory from './context/factory';
export * as APITypes from './type-validators';

export const CONTEXT = new Context();

export function configure(config: Partial<ContextConfig>) {
   CONTEXT.configure(config);
}
