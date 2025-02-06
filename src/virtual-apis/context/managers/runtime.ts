import { NativeEvent } from 'src/virtual-apis/events';
import { Kernel } from '../../../virtual-apis/isolation';
import { Diagnostics } from '../../diagnostics';
import { Context } from '../context';
import { ExecutionContext } from '../execution-context';
import type { APIClassInfo } from './factory.info';

export class ContextRuntime extends Kernel.Empty {
   public readonly context: Context;
   public readonly nativeHandles = Kernel.Construct('WeakSet');
   public readonly onDiagnostics = new NativeEvent<[ExecutionContext, Diagnostics]>();
   public constructor(context: Context) {
      super();
      this.context = context;
   }
   public isHandleNative(handle: unknown) {
      return this.nativeHandles.has(handle as object);
   }
   public reportDiagnostics(diagnostics: Diagnostics) {
      Kernel.log('TODO: ', 'implement: ' + this.reportDiagnostics.name, diagnostics);
   }
   public reportExecution(execution: ExecutionContext) {
      Kernel.warn('NO IMPLEMENTATION ERROR');
   }
   public createConstructorHandler(api: APIClassInfo) {
      return (exec: ExecutionContext) => {
         return Kernel.__create(null);
      };
   }
}
