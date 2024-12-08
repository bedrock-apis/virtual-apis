import { ClassDefinition } from './class-definition';
import { NativeEvent } from '../events';
import { Kernel } from '../kernel';
import { ParamsDefinition } from '../type-validators';

export type MethodCallBack = (methodId: string, handle: object, cache: object, definition: ClassDefinition) => unknown;
type ClassParameters<T> = T extends { new (...params: infer R): unknown } ? R : never;
export class Context extends Kernel.Empty {
   public constructor() {
      super();
   }
   public readonly nativeHandles = Kernel.Construct('WeakSet');
   public readonly nativeEvents = Kernel.Construct('Map') as ReadonlyMap<
      string,
      NativeEvent<Parameters<MethodCallBack>>
   >;
   public onInvocation<T extends MethodCallBack>(eventName: string, callBack: T) {
      const event = this.nativeEvents.get(eventName);
      if (!event) {
         throw new Kernel['ReferenceError::constructor'](`Unknown methodId specified: ${eventName}`);
      }
      event.subscribe(callBack);
   }
   public isHandleNative(handle: unknown) {
      return this.nativeHandles.has(handle as object);
   }
   // Without first parameter!!!
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   public createClassDefinition<T extends ClassDefinition | null>(
      name: string,
      parent: T,
      paramDefinition: ParamsDefinition = new ParamsDefinition(),
      hasConstructor = false,
      newExpected = true,
   ): ClassDefinition<T, object, object> {
      return new ClassDefinition<T, object, object>(this, name, parent, paramDefinition, hasConstructor, newExpected);
   }
}
