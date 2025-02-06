import { Kernel } from '../isolation/kernel';
import { ContextOptions } from './options';
import { ContextRuntime, ContextTypeManager as ContextTypesManager } from './managers';
import { ContextFactory } from './managers';
import { ExecutionContext } from './execution-context';

export class Context extends Kernel.Empty {
   public readonly options = new ContextOptions();
   public readonly typesManager = new ContextTypesManager(this);
   public readonly runtime = new ContextRuntime(this);
   public readonly factory = new ContextFactory(this);
}
