import { ClassDefinition } from './class-definition';
import { NativeEvent } from './events';
import { Kernel } from './kernel';

export type MethodCallBack = (methodId: string, handle: object, cache: object, definition: ClassDefinition) => unknown;
export class APIWrapper extends Kernel.Empty {
   private constructor() {
      super();
   }
   public static readonly nativeHandles = Kernel.Construct('WeakSet');
   public static readonly nativeEvents = Kernel.Construct('Map') as ReadonlyMap<
      string,
      NativeEvent<Parameters<MethodCallBack>>
   >;
   public static OnMethod<T extends MethodCallBack>(eventName: string, callBack: T) {
      const event = this.nativeEvents.get(eventName);
      if (!event) {
         throw new Kernel['ReferenceError::constructor'](`Unknown methodId specified: ${eventName}`);
      }
      event.subscribe(callBack);
   }
   /**
    * @param handle object exposed with apis
    * @returns whenever the handle is valid handle to native src
    */
   public static HandleIsNative(handle: unknown) {
      return this.nativeHandles.has(handle as object);
   }
}
