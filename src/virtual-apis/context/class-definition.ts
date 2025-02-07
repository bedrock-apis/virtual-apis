import { ContextPanicError, PANIC_ERROR_MESSAGES } from '../diagnostics';
import { NativeEvent } from '../events';
import { KernelArray } from '../isolation';
import { Kernel } from '../isolation/kernel';
import { ParamsDefinition, Type, VoidType } from '../type-validators';
import { ClassBindType } from '../type-validators/types/class';
import type { Context } from './context';
import { ConstructionExecutionContext, InstanceExecutionContext } from './execution-context';
import { createConstructorFor, createPropertyHandler, createMethodFor } from './factory';

export class ClassDefinition extends Kernel.Empty {
   public readonly constructorId: string;
   public readonly type: Type;
   public readonly hasConstructor: boolean;
   /** TODO: Improve the types tho */
   public readonly api: new (...p: unknown[]) => unknown;
   /**
    * @param classId Fake API Class Name
    * @param parent Inject inheritance
    */
   public constructor(
      public readonly context: Context,
      /** Fake API Class Name */
      public readonly classId: string,
      public readonly parent: T,
      public readonly constructorParams: ParamsDefinition | null,
      public readonly newExpected: boolean = true,
   ) {
      super();
      this.hasConstructor = Kernel['Boolean::constructor'](constructorParams);
      this.api = createConstructorFor(this, constructorParams ?? new ParamsDefinition());
      this.constructorId = `${classId}::constructor`;
      if (context.nativeEvents.has(this.constructorId)) {
         throw new Kernel['ReferenceError::constructor'](`Class with this id already exists '${classId}'`);
      }
      (context.nativeEvents as unknown as Map<unknown, unknown>).set(
         this.constructorId,
         (this.onConstruct = new NativeEvent()),
      );
      this.virtualApis.set(this.constructorId, this.api as () => unknown);
      context.registerType(classId, (this.type = new ClassBindType(this as ClassDefinition)));
   }

   /** @returns New Virtual API Instance of the handle */
   public create(): this['api']['prototype'] {
      const [handle] = this.__construct(
         new ConstructionExecutionContext(
            this.getAPIMethod(this.constructorId as keyof P) as (...p: unknown[]) => unknown,
            this as ClassDefinition,
            KernelArray.Construct<unknown>(),
         ),
      ).getIterator();
      return Kernel.__setPrototypeOf(handle, this.api.prototype);
   }

   public addMethod<Name extends string>(
      name: Name,
      params: ParamsDefinition = new ParamsDefinition(),
      returnType: Type = new VoidType(),
   ) {
      const method = ((this.api.prototype as Record<Name, unknown>)[name] = createMethodFor(
         this,
         name,
         params,
         returnType,
      ));
      const id = `${this.classId}::${name}`;
      this.addInvocable(id, method as () => unknown);
      return this as ClassDefinition<T, P & Record<Name, (...params: unknown[]) => unknown>, S, NAME>;
   }

   public addProperty<Name extends string>(name: Name, type: Type, isReadonly: boolean) {
      // TODO

      const getter = createPropertyHandler(this as ClassDefinition, name, type, false);
      const setter = isReadonly ? undefined : createPropertyHandler(this as ClassDefinition, name, type, true);
      Kernel.__defineProperty(this.api.prototype, name, {
         configurable: true,
         enumerable: true,
         get: getter as () => void,
         set: setter as (n: unknown) => void,
      });

      this.addInvocable(`${this.classId}::${name} getter`, getter as () => unknown);
      if (setter) this.addInvocable(`${this.classId}::${name} setter`, setter as () => unknown);
      return this as ClassDefinition<T, P & Record<Name, unknown>, S>;
   }

   public addStaticFunction<Name extends string>(
      name: Name,
      params: ParamsDefinition = new ParamsDefinition(),
      returnType: Type = new VoidType(),
   ) {
      //throw new ContextPanicError(PANIC_ERROR_MESSAGES.NoImplementation);
      return this as ClassDefinition<T, P, S & Record<Name, (...params: unknown[]) => unknown>, NAME>;
   }

   public addStaticConstant<PropertyType, Name extends string>(
      name: Name,
      type: string,
      isReadonly: boolean,
      defaultValue: unknown,
   ) {
      // TODO
      // (this.api as Record<Name, unknown>)[name] = defaultValue;
      Kernel.warn(new ContextPanicError(PANIC_ERROR_MESSAGES.NoImplementation));
      return this as ClassDefinition<T, P, S & Record<Name, PropertyType>, NAME>;
   }

   /**
    * @param params IArguments passed by api context, unpredictable but type safe
    * @returns Handle and cache pair
    */
   public __construct(context: ConstructionExecutionContext): KernelArray<object> {
      let data = this.parent?.__construct(context);
      if (!data) data = KernelArray.Construct(Kernel.__create(null), Kernel.__create(null));

      const handle = data[0];
      const cache = data[1];
      if (!cache || !handle) throw new Kernel['globalThis::TypeError']('Cache or handle is undefined');

      this.context.nativeHandles.add(handle);
      this.HANDLE_TO_NATIVE_CACHE.set(handle, cache);
      this.NATIVE_TO_HANDLE_CACHE.set(cache, handle);

      const results = this.onConstruct.invoke(handle, cache, this, context);
      if (results.successCount !== results.totalCount) {
         // TODO: Some exceptions were throw by plugin calls
      }

      return data;
   }
   public __call(context: InstanceExecutionContext) {
      if (context.definition) {
         const event = this.invocable.get(context.method);
         if (event) {
            const result = event.invoke(
               context.handle as object,
               // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
               this.HANDLE_TO_NATIVE_CACHE.get(context.handle as object)!,
               this,
               context,
            );
            if (result.successCount !== result.totalCount) {
               Kernel.log(result);
            }
         }
      }
   }
}
