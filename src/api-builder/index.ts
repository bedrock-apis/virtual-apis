import { Context } from './context';
export { Kernel } from './isolation/kernel';

export { ConfigContextOptions } from './context';
export { ClassDefinition } from './context/class-definition';

export * as APIPlugin from '../plugin-api';
export * as APIFactory from './context/factory';
export * as APITypes from './type-validators';

export const CONTEXT = new Context();
