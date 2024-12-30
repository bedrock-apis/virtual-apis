import { Context } from './context';
export { Kernel } from './isolation/kernel';

export { ConfigContextOptions } from './context';
export { ClassDefinition } from './context/class-definition';

export * as APIFactory from './context/factory';
export * as APIPlugin from '../plugin';
export * as APITypes from './type-validators';

export const CONTEXT = new Context();
