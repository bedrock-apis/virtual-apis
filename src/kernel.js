export class Kernel{
    static __call = Function.prototype.call; // Type to Type call method
    static call= Function.prototype.call.bind(Function.prototype.call);
    static __setPrototypeOf = Object.setPrototypeOf;
    static __defineProperty = Object.defineProperty;
    static __create = Object.create;
    static construct(name, useNew=true, ...args){
        if(useNew) return Kernel.__setPrototypeOf(new Kernel[name + "::constructor"](...args),Kernel[name+"::prototype"]);
        else return Kernel.__setPrototypeOf(Kernel[name + "::constructor"](...args),Kernel[name+"::prototype"]);
    }
    static As(object,name){
        return Kernel.__setPrototypeOf(object,Kernel[name + "::prototype"]);
    }
    static Constructor(name){
        return Kernel[name + "::constructor"];
    }
    static Prototype(name){
        return Kernel[name + "::prototype"];
    }
    static Static(name){
        return Kernel[name + "::static"];
    }
    static SetName(func,name){
        Kernel.__defineProperty(func,"name",{value:name,enumerable:false,configurable:true,writable:false});
        return func;
    }
    static SetLength(func,length){
        Kernel.__defineProperty(func,"length",{value:length,enumerable:false,configurable:true,writable:false});
        return func;
    }
    static SetClass(func,name){
        Kernel.SetName(func,name);
        Kernel.SetFakeNative(func);
        return Kernel.LockPrototype(func);
    }
    static LockPrototype(func){
        Kernel.__defineProperty(func,"prototype",{value:func.prototype,enumerable:false,configurable:false,writable:false});
        return func;
    }
    static SetFakeNative(func){
        if(typeof func === "function") $native_functions.add(func);
    }
    static IsFaleNative(func){
        if(typeof func === "function") return $native_functions.has(func);
        else return false;
    }
    static SetGlobalThis(){ }
    static __globalThis = globalThis;
}
const classes = Object.getOwnPropertyNames(globalThis).map(k=>globalThis[k]).filter(v=>typeof v === "function" && v.prototype);
for(const constructor of classes){
    Kernel[constructor.name + "::constructor"] = constructor;
    Kernel[constructor.name + "::prototype"] = Object.defineProperties({},Object.getOwnPropertyDescriptors(constructor.prototype));
    Kernel[constructor.name + "::static"] = Object.defineProperties({},Object.getOwnPropertyDescriptors(constructor));
}
const $native_functions = Kernel.Construct("WeakSet");
$native_functions.add(Function.prototype.toString = function(){
    if($native_functions.has(this) && typeof this === "function") return `function ${this.name}() {\n    [native code]\n}`;
    const string = Kernel.As(Kernel.call(Kernel["Function::prototype"].toString,this),"String");
    return string + "";
});