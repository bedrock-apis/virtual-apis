import { ClassDefinition } from './class-definition';
import { NativeEvent } from '../events';
import { Kernel } from '../kernel';
import { DynamicType, ParamsDefinition, type Type } from '../type-validators';

export type MethodCallBack = (methodId: string, handle: object, cache: object, definition: ClassDefinition) => unknown;

export class Context extends Kernel.Empty {
   private readonly types = Kernel.Construct('Map') as Map<string, Type>;
   private readonly unresolvedTypes = Kernel.Construct('Map') as Map<string, DynamicType>;
   /**
    * Register new type
    * @param name
    * @param type
    */
   public registerType(name: string, type: Type) {
      this.types.set(name, type);
   }
   /**
    * Get dynamic type that will resolve once this.resolveAll is called
    * @param name
    * @returns
    */
   public getDynamicType(name: string) {
      let dynamicType = this.unresolvedTypes.get(name);
      if (!dynamicType) {
         this.unresolvedTypes.set(name, (dynamicType = new DynamicType()));
      }
      return dynamicType;
   }
   /**
    * Tries to resolve all unresolved types
    */
   public resolveAllDynamicTypes() {
      for (const typeName of this.unresolvedTypes.keys()) {
         const resolvedType = this.types.get(typeName);
         if (!resolvedType) continue;
         // It is available trust me!!!
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         const unresolvedType = this.unresolvedTypes.get(typeName)!;
         unresolvedType.setType(resolvedType);
         this.unresolvedTypes.delete(typeName);
      }
   }
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
