
//#region src/api-builder/kernel.ts
var Kernel = class Kernel {
	static __call = Function.prototype.call;
	static call = Function.prototype.call.bind(Function.prototype.call);
	static __setPrototypeOf = Object.setPrototypeOf;
	static __defineProperty = Object.defineProperty;
	static __create = Object.create;
	static Construct(name, useNew = true, ...args) {
		if (useNew) return Kernel.__setPrototypeOf(new KernelStorage[name + "::constructor"](...args), KernelStorage[name + "::prototype"]);
else return Kernel.__setPrototypeOf(KernelStorage[name + "::constructor"](...args), KernelStorage[name + "::prototype"]);
	}
	static As(object, name) {
		return Kernel.__setPrototypeOf(object, KernelStorage[name + "::prototype"]);
	}
	static Constructor(name) {
		return KernelStorage[name + "::constructor"];
	}
	static Prototype(name) {
		return KernelStorage[name + "::prototype"];
	}
	Static(name) {
		return KernelStorage[name + "::public static "];
	}
	static SetName(func, name) {
		Kernel.__defineProperty(func, "name", {
			value: name,
			enumerable: false,
			configurable: true,
			writable: false
		});
		return func;
	}
	static SetLength(func, length) {
		Kernel.__defineProperty(func, "length", {
			value: length,
			enumerable: false,
			configurable: true,
			writable: false
		});
		return func;
	}
	static SetClass(func, name) {
		Kernel.SetName(func, name);
		Kernel.SetFakeNative(func);
		return Kernel.LockPrototype(func);
	}
	static LockPrototype(func) {
		Kernel.__defineProperty(func, "prototype", {
			value: func.prototype,
			enumerable: false,
			configurable: false,
			writable: false
		});
		return func;
	}
	static SetFakeNative(func) {
		if (typeof func === "function") $native_functions.add(func);
	}
	static IsFakeNative(func) {
		if (typeof func === "function") return $native_functions.has(func);
else return false;
	}
	static SetGlobalThis() {}
	static __globalThis = globalThis;
};
const KernelStorage = Kernel;
const classes = Object.getOwnPropertyNames(globalThis).map((k) => globalThis[k]).filter((v) => typeof v === "function" && v.prototype);
for (const constructor of classes) {
	KernelStorage[constructor.name + "::constructor"] = constructor;
	KernelStorage[constructor.name + "::prototype"] = Object.defineProperties({}, Object.getOwnPropertyDescriptors(constructor.prototype));
	KernelStorage[constructor.name + "::public static "] = Object.defineProperties({}, Object.getOwnPropertyDescriptors(constructor));
}
const $native_functions = Kernel.Construct("WeakSet");
$native_functions.add(Function.prototype.toString = function() {
	if ($native_functions.has(this) && typeof this === "function") return `function ${this.name}() {\n    [native code]\n}`;
	const string = Kernel.As(Kernel.call(KernelStorage["Function::prototype"].toString, this), "String");
	return string + "";
});

//#endregion
//#region src/api-builder/api-wrapper.ts
var APIWrapper = class {
	constructor() {}
	static NATIVE_HANDLES = Kernel.Construct("WeakSet");
	static NATIVE_EVENTS = Kernel.Construct("Map");
	static onMethod(eventName, callBack) {
		const event = this.NATIVE_EVENTS.get(eventName);
		if (!event) throw Kernel.Construct("ReferenceError", true, `Unknown methodId specified: ${eventName}`);
		event.subscribe(callBack);
	}
	/**
	
	* @param handle object exposed with apis
	
	* @returns whenever the handle is valid handle to native src
	
	*/
	static handleIsNative(handle) {
		return this.NATIVE_HANDLES.has(handle);
	}
};

//#endregion
//#region src/api-builder/errors.ts
const TypeError$1 = Kernel.Constructor("TypeError");
const ReferenceError$1 = Kernel.Constructor("ReferenceError");
const Error = Kernel.Constructor("Error");
const Errors = {
	NewExpected() {
		return new TypeError$1("must be called with new");
	},
	NoConstructor(id) {
		return new ReferenceError$1(`No constructor for native class '${id}'.`);
	},
	IncorrectNumberOfArguments(t, length) {
		return new TypeError$1(`Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`);
	},
	BoundToPrototype(kind, id) {
		return new ReferenceError$1(`Native ${kind} [${id}] object bound to prototype does not exist.`);
	},
	NoPrivilege(kind, id) {
		return new ReferenceError$1(`Native ${kind} [${id}] does not have required privileges.`);
	},
	InvalidAmount(min = 0, max = 256) {
		return new Error(`Invalid amount. Amount must be greater than ${min} and less than ${max}`);
	},
	InvalidTimeOfDay(min = 0, max = 23999) {
		return new Error(`timeOfDay must be between ${min} and ${max} (inclusive)`);
	},
	ItemTypeDoesNotExist(itemType) {
		return new TypeError$1(`ItemType '${itemType}' does not exists`);
	},
	NativeOptionalTypeConversationFailed() {
		return new TypeError$1("Native optional type conversion failed");
	},
	FailedTo(action, kind, name) {
		return new Error(`Failed to ${action} ${kind} '${name}'`);
	}
};

//#endregion
//#region src/api-builder/api-builder.ts
var APIBuilder = class {
	/**
	
	* Builds new Fake API Class
	
	* @param definition Class Definition
	
	* @returns API Class function
	
	*/
	static CreateConstructor(definition) {
		const ctor = function() {
			if (!new.target) throw new (Kernel.Constructor("TypeError"))("must be called with new");
			if (!definition.hasConstructor) throw Errors.NoConstructor(definition.classId);
			const result = Kernel.__setPrototypeOf(definition.construct(arguments)[0], new.target.prototype);
			return result;
		};
		ctor.prototype = { constructor: ctor };
		const parent = definition.parent;
		if (parent) {
			Kernel.__setPrototypeOf(ctor, parent.apiClass);
			Kernel.__setPrototypeOf(ctor.prototype, parent.apiClass.prototype);
		}
		Kernel.SetClass(ctor, definition.classId);
		return ctor;
	}
	/**
	
	* @param definition Class Definition
	
	* @param id Name of the function
	
	* @returns Fake API Functions
	
	*/
	static CreateMethod(definition, id) {
		const ctor = (that, params) => {
			if (!APIWrapper.NATIVE_HANDLES.has(that)) throw new (Kernel.Constructor("ReferenceError"))(`Native function [${definition.classId}::${id}] object bound to prototype does not exist.`);
			const results = null;
			return results;
		};
		Kernel.SetFakeNative(ctor);
		Kernel.SetLength(ctor, 0);
		Kernel.SetName(ctor, id);
		const final = new Proxy(ctor, { apply(t, that, params) {
			return t(that, params);
		} });
		Kernel.SetFakeNative(final);
		return final;
	}
};

//#endregion
//#region src/api-builder/events.ts
/**

* Represents an event signal.

* - The types of the arguments passed to the event handlers.

*/
const SESSIONS = Kernel.Construct("WeakMap");
var NativeEvent = class {
	constructor() {
		SESSIONS.set(this, new Set());
	}
	/**
	
	* Triggers the event signal.
	
	* @param params - The arguments to pass to the event handlers.
	
	* @returns A promise that resolves with the number of successful event handlers.
	
	*/
	async trigger(...params) {
		if (SESSIONS.has(this)) {
			const promises = [];
			SESSIONS.get(this)?.forEach((method) => {
				promises.push((async () => method(...params))().catch((e) => console.error(e, e.stack)));
			});
			await Promise.all(promises);
		}
	}
	/**
	
	* Subscribes to the event signal.
	
	* @template  k - The type of the event handler function.
	
	* @param method - The event handler function to subscribe.
	
	* @returns The subscribed event handler function.
	
	*/
	subscribe(method) {
		const t = typeof method;
		if (t !== "function") throw new TypeError(`Expected a function, but got ${t}.`);
		if (SESSIONS.has(this)) {
			const set = SESSIONS.get(this);
			if (!set.has(method)) set.add(method);
		}
		return method;
	}
	/**
	
	* Unsubscribes from the event signal.
	
	* @template k - The type of the event handler function.
	
	* @param method - The event handler function to unsubscribe.
	
	* @returns The unsubscribed event handler function.
	
	*/
	unsubscribe(method) {
		const t = typeof method;
		if (t !== "function") throw new TypeError(`Expected a function, but got ${t}.`);
		if (SESSIONS.has(this)) SESSIONS.get(this)?.delete(method);
		return method;
	}
};

//#endregion
//#region src/api-builder/type-validators/base-types.ts
const IsFinite = Kernel.__globalThis["isFinite"];
const Number = Kernel.Constructor("Number");
var BaseType = class {
	static BIND_TYPE_TYPES = Kernel.Construct("Map");
	static register(name, type) {
		this.BIND_TYPE_TYPES.set(name, type);
	}
	static resolve(metadataType) {
		throw new ReferenceError("No implementation error");
	}
};

//#endregion
//#region src/api-builder/type-validators/bind-type.ts
var ClassBindType = class extends BaseType {
	constructor(definition) {
		super();
		this.definition = definition;
	}
	validate(object) {
		if (!this.definition.isThisType(object)) return new ReferenceError("No implementation error");
		return null;
	}
};

//#endregion
//#region src/api-builder/class-definition.ts
var ClassDefinition = class {
	HANDLE_TO_NATIVE_CACHE = Kernel.Construct("WeakMap");
	NATIVE_TO_HANDLE_CACHE = Kernel.Construct("WeakMap");
	onConstruct;
	constructorId;
	/**
	
	* TODO: Improve the types tho
	
	*/
	apiClass;
	/**
	
	*
	
	* @param classId Fake API Class Name
	
	* @param parent Inject inheritance
	
	*/
	constructor(classId, parent, hasConstructor = false, newExpected = true) {
		this.classId = classId;
		this.parent = parent;
		this.hasConstructor = hasConstructor;
		this.newExpected = newExpected;
		this.apiClass = APIBuilder.CreateConstructor(this);
		this.constructorId = `${classId}:constructor`;
		if (APIWrapper.NATIVE_EVENTS.has(this.constructorId)) throw Kernel.Construct("ReferenceError", true, `Class with this id already exists '${classId}'`);
		APIWrapper.NATIVE_EVENTS.set(this.constructorId, this.onConstruct = new NativeEvent());
		BaseType.register(classId, new ClassBindType(this));
	}
	/**
	
	*
	
	* @param params IArguments passed by api context, unpredictable but type safe
	
	* @returns handle and cache pair
	
	*/
	construct(params) {
		let data = this.parent?.construct(params);
		if (!data) data = [Kernel.__create(null), Kernel.__create(null)];
		const [handle, cache] = data;
		APIWrapper.NATIVE_HANDLES.add(handle);
		this.HANDLE_TO_NATIVE_CACHE.set(handle, cache);
		this.NATIVE_TO_HANDLE_CACHE.set(cache, handle);
		this.onConstruct.trigger(handle, cache, this, params);
		return data;
	}
	/**
	
	* If specific handle is type of this definition
	
	*/
	isThisType(handle) {
		return this.HANDLE_TO_NATIVE_CACHE.has(handle);
	}
	addMethod(name, isStatic = false, params, returnType) {
		this.apiClass.prototype[name] = APIBuilder.CreateMethod(this, name);
		return this;
	}
	addProperty(name, type, isReadonly) {
		return this;
	}
	addStaticProperty(name, type, isReadonly, defaultValue) {
		this.apiClass[name] = defaultValue;
		return this;
	}
	__APICall(that, id, params) {
		console.log("call: " + id);
	}
};

//#endregion
export { APIBuilder, ClassDefinition, Kernel };