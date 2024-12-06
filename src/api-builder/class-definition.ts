import { MetadataFunctionArgumentDefinition } from '../codegen/ScriptModule';
import { APIBuilder } from './api-builder';
import { Kernel } from './kernel';
import { DefaultMetadataType } from './type-validators/default-types';

// Class for single fake api definition

export class ClassDefinition<T extends ClassDefinition | null = null, P = object, Static extends object = object> {
  public readonly nativeCache = Kernel.constructor('WeakMap');

  public readonly cache = Kernel.Construct('WeakMap');

  /**
   * TODO: Improve the types tho
   */
  public readonly apiClass: {
    new (...any: unknown[]): P & (T extends ClassDefinition ? T['apiClass']['prototype'] : object);
    readonly name: string;
    readonly prototype: P & (T extends ClassDefinition ? T['apiClass']['prototype'] : object);
  } & Static;

  /**
   *
   * @param classId Fake API Class Name
   * @param parent Inject inheritance
   */
  public constructor(
    /**
     * Fake API Class Name
     */
    public readonly classId: string,
    public readonly parent: T,
    public readonly hasConstructor: boolean = false,
    public readonly newExpected: boolean = true,
  ) {
    this.apiClass = APIBuilder.CreateConstructor(this);
  }

  public addMethod<Name extends string>(
    name: Name,
    params?: MetadataFunctionArgumentDefinition,
    returnType?: DefaultMetadataType,
  ) {
    (this.apiClass.prototype as Record<Name, unknown>)[name] = APIBuilder.CreateMethod(this, name);

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
    (this.apiClass as Record<Name, unknown>)[name] = defaultValue;

    return this as ClassDefinition<T, P, Static & Record<Name, PropertyType>>;
  }

  public addConstructor(params: MetadataFunctionArgumentDefinition) {
    // TODO

    return this;
  }

  public __newAPIInstance(params: IArguments) {
    console.log('New instance creation');
    return Kernel.__create(null);
  }
  public __APICall(that: unknown, id: string, params: unknown[]) {
    console.log('call: ' + id);
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
