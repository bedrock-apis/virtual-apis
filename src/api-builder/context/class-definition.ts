import { APIBuilder } from './api-builder';
import type { Context } from './context';
import { Diagnostics } from '../errors';
import { NativeEvent } from '../events';
import { ConstructionExecutionContext, ExecutionContext } from './execution-context';
import { Kernel } from '../kernel';
import { ParamsDefinition, Type, VoidType } from '../type-validators';
import { ClassBindType } from '../type-validators/types/class';

// Class for single fake api definition

export class ClassDefinition<
   T extends ClassDefinition | null = null,
   P = object,
   S extends object = object,
> extends Kernel.Empty {
   private readonly HANDLE_TO_NATIVE_CACHE = Kernel.Construct('WeakMap');
   private readonly NATIVE_TO_HANDLE_CACHE = Kernel.Construct('WeakMap');
   public readonly onConstruct: NativeEvent<[object, object, this, ConstructionExecutionContext]>;
   public readonly constructorId: string;
   public readonly type: Type;
   /**
    * TODO: Improve the types tho
    */
   public readonly api: {
      new (...any: unknown[]): P & (T extends ClassDefinition ? T['api']['prototype'] : object);
      readonly name: string;
      readonly prototype: P & (T extends ClassDefinition ? T['api']['prototype'] : object);
   } & S &
      (T extends ClassDefinition ? Omit<T['api'], 'prototype' | 'name'> : object);

   /**
    *
    * @param classId Fake API Class Name
    * @param parent Inject inheritance
    */
   public constructor(
      public readonly context: Context,
      /**
       * Fake API Class Name
       */
      public readonly classId: string,
      public readonly parent: T,
      public readonly hasConstructor: boolean = false,
      public readonly newExpected: boolean = true,
      public readonly paramsDefinition: ParamsDefinition = new ParamsDefinition(),
   ) {
      super();
      this.api = APIBuilder.CreateConstructor(this, paramsDefinition);
      this.constructorId = `${classId}:constructor`;
      if (context.nativeEvents.has(this.constructorId)) {
         throw new (Kernel.Constructor('ReferenceError'))(`Class with this id already exists '${classId}'`);
      }
      (context.nativeEvents as unknown as Map<unknown, unknown>).set(
         this.constructorId,
         (this.onConstruct = new NativeEvent()),
      );

      Type.RegisterBindType(classId, (this.type = new ClassBindType(this as ClassDefinition)));
   }

   /**
    *
    * @returns New Virtual API Instance of the handle
    */
   public create(): this['api']['prototype'] {
      const [handle, cache] = this.__construct(
         new ConstructionExecutionContext(
            this as ClassDefinition,
            this.classId,
            Kernel.Construct('Array'),
            new Diagnostics(),
         ),
      );
      return Kernel.__setPrototypeOf(handle, this.api.prototype);
   }
   /**
    * If specific handle is type of this definition
    */
   public isThisType(handle: unknown): handle is this['api']['prototype'] {
      return this.HANDLE_TO_NATIVE_CACHE.has(handle as object);
   }

   public addMethod<Name extends string>(name: Name, params: ParamsDefinition, returnType: Type = new VoidType()) {
      (this.api.prototype as Record<Name, unknown>)[name] = APIBuilder.CreateMethod(this, name, params, returnType);

      return this as ClassDefinition<T, P & Record<Name, (...params: unknown[]) => unknown>>;
   }

   public addProperty<PropertyType, Name extends string>(name: Name, type: string, isReadonly: boolean) {
      // TODO

      return this as ClassDefinition<T, P & Record<Name, PropertyType>>;
   }

   public addStaticProperty<PropertyType, Name extends string>(
      name: Name,
      type: string,
      isReadonly: boolean,
      defaultValue: unknown,
   ) {
      // TODO
      (this.api as Record<Name, unknown>)[name] = defaultValue;

      return this as ClassDefinition<T, P, S & Record<Name, PropertyType>>;
   }

   /**
    *
    * @param params IArguments passed by api context, unpredictable but type safe
    * @returns handle and cache pair
    */
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public __construct(context: ConstructionExecutionContext): [object, object] {
      let data = this.parent?.__construct(context);
      if (!data) data = Kernel.Construct('Array', Kernel.__create(null), Kernel.__create(null)) as [object, object];
      const [handle, cache] = data;

      this.context.nativeHandles.add(handle);
      this.HANDLE_TO_NATIVE_CACHE.set(handle, cache);
      this.NATIVE_TO_HANDLE_CACHE.set(cache, handle);

      this.onConstruct.trigger(handle, cache, this, context).catch(Kernel.error);

      return data;
   }
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public __call(context: ExecutionContext) {
      Kernel.log('call: ' + context.methodId);
   }
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public __reports(context: ConstructionExecutionContext) {
      Kernel.log('pre-call: diagnostics ' + context.diagnostics.errors.length);
   }

   /**
    * TRASH HERE
    * @param factory
    * @returns
    */
   /*
    setConstructFunction(factory: (cache: any, definition: this, handle: object, data: any) => object){
        this.factory = factory;
        return this;
    }
    setHasConstructor(hasConstructor){
        this.hasConstructor = hasConstructor??false;
        return this;
    }
    setNewExpected(newExpected){
        this.newExpected = newExpected??false;
        return this;
    }
    CreateNativeInstance(data){
        const pub = {};
        const cache = {};
        this.__nativeConstruct(cache, pub, data, this);
        nativeObjects.add(pub);
        return pub;
    }
    AddMethod(name, functionValidator){
        APIBuilder.CreateMethod(this, this.className + "::" + name, )
    }
    GetCache(handle){ return this.cache.get(handle); }
    FreeHandle(handle){
        const a = this.cache.get(handle);
        this.native.delete(a);
        this.cache.delete(handle);
        nativeObjects.delete(handle);
    }
    FreeObject(cache){
        const a = this.native.get(cache);
        this.native.delete(cache);
        this.cache.delete(a);
        nativeObjects.delete(a);
    }
    __isThisType(data){
        return this.cache.has(data);
    }
    __nativeConstruct(cache, pub, data, newTarget){
        if(this.parent) this.parent.__nativeConstruct(cache, pub, data, newTarget);
        this.factory(cache, newTarget, pub, data);
        this.cache.set(pub, cache);
        this.native.get(cache, pub);
    }
    __constructionCallBack(...params){
        return  this.CreateNativeInstance(this.dataBuilder(...params));
    }
    __methodCall(cache, handle, id, ...params){
        return 5;
    }*/
}
