import { Kernel } from "../kernel.js";
import { APIBuilder } from "./api-builder.js";

// Class for single fake api definition

export class ClassDefinition {
    /**
     * Fake API Class Name
     */
    public readonly classId: string;

    public readonly nativeCache = Kernel.constructor("WeakMap");

    public readonly cache = Kernel.Construct("WeakMap");

    public readonly parent: ClassDefinition | null;

    // HARDCODED VALUES FOR NOW
    public readonly hasConstructor: boolean = false;
    public readonly newExpected: boolean = true;
    
    /**
     * TODO: Improve the types tho
     */
    public readonly apiClass: {new(...any: any[]): any};

    /**
     * 
     * @param classId Fake API Class Name
     * @param parent Inject inheritance
     * 
     * TODO: Add option to set constructor api validation
     */
    public constructor(classId: string, parent: ClassDefinition | null = null){
        this.classId = classId;
        this.parent = parent;
        this.apiClass = APIBuilder.CreateConstructor(this);
    }














/**
 * TRASH HERE
 * @param factory 
 * @returns 
 */
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
    }
}