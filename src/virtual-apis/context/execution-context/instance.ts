import { KernelArray } from '../../isolation';
import { Context } from '../context';
import { ExecutionContext } from '../execution-context';
import type { APIInfo } from '../managers/factory.info';

export class InstanceExecutionContext extends ExecutionContext {
   public readonly handle: unknown;
   public constructor(context: Context, api: APIInfo, handle: unknown, params: KernelArray<unknown>) {
      super(context, api, params);
      this.handle = handle;
   }
}
