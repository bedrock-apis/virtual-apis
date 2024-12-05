import { Kernel } from "../kernel.js";
import { ErrorConstructors, ErrorMessages } from "./errors.js";
import { ClassDefinition } from "./class-definition.js";
// import { FunctionType } from "./type-validators/index.js";

export class APIBuilder{
    /**
     * @param definition Class definition for target constructor
     * @returns 
     */
    public static CreateConstructor(definition: ClassDefinition /*, functionType: FunctionType*/): {new(...any: any[]):any, readonly prototype: any}{
        const ctor = function(){
            if(!new.target) throw new ErrorConstructors.NewExpected(ErrorMessages.NewExpected());
            if(!definition.hasConstructor) throw new ErrorConstructors.NoConstructor(ErrorMessages.NoConstructor(definition.classId));
            // const error = functionType.ValidArgumentTypes(arguments);
            //if(error) throw new error.ctor(error.message)
            const ret = Kernel.__setPrototypeOf(definition.__constructionCallBack(...arguments), new.target.prototype);
            return ret;
        };
        ctor.prototype = {constructor:ctor};
        const parent = definition.parent;
        if(parent) {
            Kernel.__setPrototypeOf(ctor, parent.apiClass);
            Kernel.__setPrototypeOf(ctor.prototype, parent.apiClass.prototype);
        }
        Kernel.SetClass(ctor, definition.classId);
        return ctor as any;
    }
    /**@param {APIClassDefinition} definition @param {FunctionValidator} functionType  */
    static CreateMethod(definition, id, functionType){
        const ctor = (that, params)=>{
            if(!nativeObjects.has(that)) throw new ErrorConstructors.BoundToPrototype(ErrorMessages.BoundToPrototype("function",id));
            if(currentPrivilege && currentPrivilege !== functionType.privilege) throw new ErrorConstructors.NoPrivilege(ErrorMessages.NoPrivilege("function", id));
            let error = functionType.ValidArgumentTypes(params);
            if(error) throw new error.ctor(error.message);
            const cache = definition.cache.get(that);
            if(!cache) return undefined;
            const returnKind = definition.__methodCall(cache, that, id, ...params);            
            error = functionType.ResolveReturnType(returnKind);
            if(error) throw new error.ctor(error.message);
            return returnKind;
        };
        Kernel.SetFakeNative(ctor);
        Kernel.SetLength(ctor, 0);
        Kernel.SetName(ctor, "");

        const final = new Proxy(ctor, {apply(t,that,params){return t(that,params)}});
        Kernel.SetFakeNative(final);
        return final;
    }
    /**@param {APIClassDefinition} definition @param {FunctionValidator} functionType  */
    static CreateSetter(definition, id, functionType){
        const ctor = (that, params)=>{
            if(!nativeObjects.has(that)) throw new ErrorConstructors.BoundToPrototype(ErrorMessages.BoundToPrototype("property setter",id));
            let error = functionType.ValidArgumentTypes(params);
            if(error) throw new error.ctor(error.message);
            const cache = definition.cache.get(that);
            if(!cache) return undefined;
            const returnKind = definition.__methodCall(cache, that, id, ...params);            
            error = functionType.ResolveReturnType(returnKind);
            if(error) throw new error.ctor(error.message);
            return returnKind;
        };
        Kernel.SetFakeNative(ctor);
        Kernel.SetLength(ctor, 0);
        Kernel.SetName(ctor, "");

        const final = new Proxy(ctor, {apply(t,that,params){return t(that,params)}});
        Kernel.SetFakeNative(final);
        return final;
    }
}