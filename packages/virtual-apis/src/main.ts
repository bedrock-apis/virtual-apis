import { Context } from './context';

export * from './context';
export { ClassDefinition } from './context/class-definition';
export * as APIFactory from './context/factory';
export * as TypesValidation from './type-validators';

export const CONTEXT = new Context();