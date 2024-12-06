import { APIBuilder } from './api-builder';
import { Kernel } from './kernel';

// Class for single fake api definition

export class ClassDefinition<T extends ClassDefinition | null = null, P = object> {
  /**
   * Fake API Class Name
   */
  public readonly classId: string;

  public readonly nativeCache = Kernel.constructor('WeakMap');

  public readonly cache = Kernel.Construct('WeakMap');

  public readonly parent: T;

  // HARDCODED VALUES FOR NOW
  public readonly hasConstructor: boolean = false;
  public readonly newExpected: boolean = true;

  /**
   * TODO: Improve the types tho
   */
  public readonly apiClass: {
    new (...any: unknown[]): P & (T extends ClassDefinition ? T['apiClass']['prototype'] : object);
    readonly name: string;
    readonly prototype: P & (T extends ClassDefinition ? T['apiClass']['prototype'] : object);
  };

  /**
   *
   * @param classId Fake API Class Name
   * @param parent Inject inheritance
   *
   * TODO: Add option to set constructor api validation
   */
  public constructor(classId: string, parent: T) {
    this.classId = classId;
    this.parent = parent;
    this.apiClass = APIBuilder.CreateConstructor(this);
  }

  public addMethod<S extends string>(name: S): ClassDefinition<T, P & { [N in S]: Function }> {
    this.apiClass.prototype[name] = APIBuilder.CreateMethod(this, name);
    return this as any;
  }

  public __newAPIInstance(params: IArguments) {
    console.log('New instance creation');
    return Kernel.__create(null);
  }
  public __APICall(that: any, id: string, params: any[]) {
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
