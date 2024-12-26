import { isDeepStrictEqual } from "node:util";
import { isGeneratorObject, isPromise } from "node:util/types";

//#region rolldown:runtime
var __defProp = Object.defineProperty;
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};

//#endregion
//#region src/api-builder/kernel.ts
var KernelClass = class KernelClass {
	static Empty = function Empty() {};
	static __call = Function.prototype.call;
	static call = Function.prototype.call.bind(Function.prototype.call);
	static __setPrototypeOf = Object.setPrototypeOf;
	static __getPrototypeOf = Object.getPrototypeOf;
	static __defineProperty = Object.defineProperty;
	static __descriptors = Object.getOwnPropertyDescriptors;
	static __create = Object.create;
	static Construct(name, ...args) {
		return KernelClass.__setPrototypeOf(new KernelStorage[name + "::constructor"](...args), KernelStorage[name + "::prototype"]);
	}
	static As(object, name) {
		return KernelClass.__setPrototypeOf(object, KernelStorage[name + "::prototype"]);
	}
	static SetName(func, name) {
		KernelClass.__defineProperty(func, "name", {
			value: name,
			enumerable: false,
			configurable: true,
			writable: false
		});
		return func;
	}
	static SetLength(func, length) {
		KernelClass.__defineProperty(func, "length", {
			value: length,
			enumerable: false,
			configurable: true,
			writable: false
		});
		return func;
	}
	static SetClass(func, name) {
		KernelClass.SetName(func, name);
		KernelClass.SetFakeNative(func);
		return KernelClass.LockPrototype(func);
	}
	static LockPrototype(func) {
		KernelClass.__defineProperty(func, "prototype", {
			value: func.prototype,
			enumerable: false,
			configurable: false,
			writable: false
		});
		return func;
	}
	static SetFakeNative(func) {
		if (typeof func === "function") nativeFunctions.add(func);
	}
	static IsFakeNative(func) {
		if (typeof func === "function") return nativeFunctions.has(func);
else return false;
	}
	static SetGlobalThis() {}
	static log = console.log;
	static error = console.error;
	static warn = console.warn;
	static NewArray(...params) {
		return KernelClass.Construct("Array", ...params);
	}
	static ArrayIterator(array) {
		return KernelClass.__setPrototypeOf(KernelClass.call(Kernel["Array::prototype"].values, array), ARRAY_ITERATOR_PROTOTYPE);
	}
	static MapValuesIterator(map) {
		return KernelClass.__setPrototypeOf(KernelClass.call(Kernel["Map::prototype"].values, map), MAP_ITERATOR_PROTOTYPE);
	}
	static MapKeysIterator(map) {
		return KernelClass.__setPrototypeOf(KernelClass.call(Kernel["Map::prototype"].keys, map), MAP_ITERATOR_PROTOTYPE);
	}
	static SetIterator(set) {
		return KernelClass.__setPrototypeOf(KernelClass.call(Kernel["Set::prototype"].values, set), SET_ITERATOR_PROTOTYPE);
	}
	static IsolatedCopy(obj) {
		let isolated = ISOLATED_COPIES.get(obj);
		if (!isolated) {
			const prototype = KernelClass.__getPrototypeOf(obj);
			ISOLATED_COPIES.set(obj, isolated = KernelClass.__create(prototype ? this.IsolatedCopy(prototype) : prototype, KernelClass.__descriptors(obj)));
		}
		return isolated;
	}
};
const ISOLATED_COPIES = new WeakMap();
const KernelStorage = KernelClass;
KernelClass.__setPrototypeOf(KernelStorage, null);
const globalNames = Object.getOwnPropertyNames(globalThis);
for (const constructor of globalNames.map((k) => globalThis[k]).filter((v) => typeof v === "function" && v.prototype)) {
	KernelStorage[constructor.name + "::constructor"] = constructor;
	KernelStorage[constructor.name + "::prototype"] = KernelClass.IsolatedCopy(constructor.prototype);
	KernelStorage[constructor.name + "::static"] = KernelClass.IsolatedCopy(constructor);
}
for (const globalName of globalNames) KernelStorage[`globalThis::${globalName}`] = globalThis[globalName];
const nativeFunctions = KernelClass.Construct("WeakSet");
nativeFunctions.add(Function.prototype.toString = function() {
	if (nativeFunctions.has(this)) return `function ${this.name}() {\n    [native code]\n}`;
	const string = KernelClass.As(KernelClass.call(KernelStorage["Function::prototype"].toString, this), "String");
	return string + "";
});
const Kernel = KernelClass;
const ARRAY_ITERATOR_PROTOTYPE = Kernel.IsolatedCopy(Object.getPrototypeOf(Array.prototype.values.call([])));
const MAP_ITERATOR_PROTOTYPE = Kernel.IsolatedCopy(Object.getPrototypeOf(Map.prototype.values.call(new Map())));
const SET_ITERATOR_PROTOTYPE = Kernel.IsolatedCopy(Object.getPrototypeOf(Set.prototype.values.call(new Set())));
Kernel.__setPrototypeOf(Kernel.Empty, null);
Kernel.__setPrototypeOf(Kernel.Empty.prototype, null);
Kernel.__setPrototypeOf(ISOLATED_COPIES, Kernel["WeakMap::prototype"]);

//#endregion
//#region src/api-builder/type-validators/default.ts
const defaultTypes = [
	{
		is_bind_type: false,
		is_errorable: false,
		name: "int32",
		valid_range: {
			max: 2147483647,
			min: -2147483648
		}
	},
	{
		is_bind_type: false,
		is_errorable: false,
		name: "uint32",
		valid_range: {
			max: 2147483647,
			min: -2147483648
		}
	},
	{
		is_bind_type: false,
		is_errorable: false,
		name: "string"
	},
	{
		is_bind_type: false,
		is_errorable: false,
		name: "boolean"
	}
];
function isDefaultType(type) {
	return defaultTypes.find((e) => isDeepStrictEqual(e, type));
}
function toDefaultType(type) {
	if (isDefaultType(type)) return type.name;
	return type;
}
function fromDefaultType(type) {
	return typeof type === "string" ? defaultTypes.find((e) => e.name === type) : type;
}

//#endregion
//#region src/api-builder/diagnostics/reports.ts
var BaseReport = class extends Kernel.Empty {};
var Report = class extends BaseReport {
	isThrowable = true;
	childReport;
	constructor(factory, child = null) {
		super();
		this.factory = factory;
		this.childReport = child ?? null;
	}
	throw(trimStackCount = 0) {
		const error = new (this.factory.getErrorConstructor())(this.factory.getMessage());
		removeStackFromError(trimStackCount + 1, error);
		return error;
	}
};
function removeStackFromError(stackSize, error) {
	if (!error.stack) return error;
	const [text, ...stack] = error.stack.split("\n    at ");
	error.stack = Kernel.As(Kernel["Array::static"].of(text, ...stack.slice(stackSize)), "Array").join("\n    at ");
	return error;
}

//#endregion
//#region src/api-builder/diagnostics/factory.ts
var ErrorFactory = class extends Kernel.Empty {
	static New(message, type) {
		return new this(message, type);
	}
	message;
	type;
	constructor(message, type) {
		super();
		this.message = message;
		this.type = type;
	}
	getErrorConstructor() {
		return this.type ?? Kernel["Error::constructor"];
	}
	getMessage() {
		return this.message ?? "Default Base Error Message";
	}
};

//#endregion
//#region src/api-builder/diagnostics/messages.ts
const ERROR_TYPE = Kernel["Error::constructor"];
const REFERENCE_ERROR_TYPE = Kernel["ReferenceError::constructor"];
const TYPE_ERROR_TYPE = Kernel["TypeError::constructor"];
const WARNING_ERROR_MESSAGES = { SettersShouldReturnUndefined: (id) => "Result should be always undefined for property setter methods: " + id };
const PANIC_ERROR_MESSAGES = {
	EmptyDiagnosticsStackInstance: `Failed to throw report error on empty DiagnosticsStack instance.`,
	NoImplementation: `No implementation error.`,
	DynamicTypeNotResolved: (data) => `Failed to call validate on unresolved DynamicType ${data}`
};
const QUICK_JS_ENV_ERROR_MESSAGES = { NewExpected: () => ErrorFactory.New(`must be called with new`) };
const API_ERRORS_MESSAGES = {
	NoConstructor: (id) => ErrorFactory.New(`No constructor for native class '${id}'.`, REFERENCE_ERROR_TYPE),
	NoPrivilege: (kind, id) => ErrorFactory.New(`Native ${kind} [${id}] does not have required privileges.`, TYPE_ERROR_TYPE),
	NativeBound: (kind, id) => ErrorFactory.New(`Native ${kind} [${id}] object bound to prototype does not exist.`, REFERENCE_ERROR_TYPE),
	NativeConversionFailed: (type) => ErrorFactory.New(`Native ${type} conversion failed.`, TYPE_ERROR_TYPE),
	ObjectHasInvalidHandle: () => ErrorFactory.New(`Object has an invalid native handle.`, TYPE_ERROR_TYPE),
	ObjectDidNotHaveHandle: () => ErrorFactory.New(`Object did not have a native handle.`, TYPE_ERROR_TYPE),
	ArrayUnsupportedType: () => ErrorFactory.New(`Array contains unsupported type.`, TYPE_ERROR_TYPE),
	ValueNotSupported: (value) => ErrorFactory.New(`${value} value is not supported.`, TYPE_ERROR_TYPE),
	FailedTo: (action, kind, name) => ErrorFactory.New(`Failed to ${action} ${kind} '${name}'`, ERROR_TYPE),
	InvalidTimeOfDay: (min = 0, max = 23999) => ErrorFactory.New(`timeOfDay must be between ${min} and ${max} (inclusive)`, TYPE_ERROR_TYPE),
	IncorrectNumberOfArguments: (t, length) => ErrorFactory.New(`Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`, TYPE_ERROR_TYPE),
	FunctionArgumentExpectedType: (error, argument, type) => ErrorFactory.New(`${error} Function argument [${argument}] expected type: ${type}`, TYPE_ERROR_TYPE),
	FunctionArgumentBounds: (value, range, argument) => ErrorFactory.New(`Unsupported or out of bounds value passed to function argument [${argument}]. Value: ${value}, argument bounds: [${range.min}, ${range.max}]`, TYPE_ERROR_TYPE),
	OutOfRange: (value, range) => ErrorFactory.New(`Provided integer value was out of range.  Value: ${value}, argument bounds: [${range.min}, ${range.max}]`, TYPE_ERROR_TYPE),
	ItemTypeDoesNotExist: (itemType) => ErrorFactory.New(`ItemType '${itemType}' does not exists`),
	InvalidAmount: (min = 0, max = 256) => ErrorFactory.New(`Invalid amount. Amount must be greater than ${min} and less than ${max}`)
};

//#endregion
//#region src/api-builder/diagnostics/panic.ts
var ContextPanicError = class extends Kernel["Error::constructor"] {
	constructor(message) {
		super(message);
	}
};

//#endregion
//#region src/api-builder/diagnostics/diagnostics.ts
var DiagnosticsStackReport = class extends BaseReport {
	get isThrowable() {
		return !this.isEmpty;
	}
	stack = Kernel.NewArray();
	get length() {
		return this.stack.length;
	}
	report(...params) {
		const report = params[0];
		if (report instanceof Report) this.stack.push(report);
else this.stack.push(new Report(report, params[1] ?? null));
		return this;
	}
	throw(trimStackCount = 0) {
		return this.stack[0]?.throw(trimStackCount + 1) ?? new ContextPanicError(PANIC_ERROR_MESSAGES.EmptyDiagnosticsStackInstance);
	}
	clear() {
		this.stack = Kernel.NewArray();
	}
	get isEmpty() {
		return this.length === 0;
	}
	follow(diagnostics) {
		this.stack.push(...Kernel.ArrayIterator(diagnostics.stack));
		return this;
	}
};
var Diagnostics = class extends Kernel.Empty {
	get success() {
		return this.errors.length === 0;
	}
	get isEmpty() {
		return this.errors.isEmpty && this.warns.isEmpty;
	}
	errors = new DiagnosticsStackReport();
	warns = new DiagnosticsStackReport();
	throw(trimStackCount = 0) {
		throw this.errors.throw(trimStackCount + 1);
	}
};

//#endregion
//#region src/api-builder/type-validators/type.ts
var Type = class extends Kernel.Empty {};
var VoidType = class extends Type {
	validate(diagnostics, value) {
		if (value !== undefined) diagnostics.report(new ErrorFactory("Undefined value expected, but received: " + typeof value, TYPE_ERROR_TYPE));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/number.ts
const isFinite = Kernel["globalThis::isFinite"];
var BaseNumberType = class extends Type {
	constructor(range) {
		super();
		this.range = range;
	}
	validate(diagnostics, value) {
		if (typeof value !== this.type) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		if (this.isFiniteCheck && !isFinite(value)) return diagnostics.report(API_ERRORS_MESSAGES.ValueNotSupported(Kernel.call(Kernel["Number::prototype"].toString, value)));
		if (value < this.range.min || value > this.range.max) diagnostics.report(API_ERRORS_MESSAGES.OutOfRange(value, this.range));
		return diagnostics;
	}
};
var NumberType = class extends BaseNumberType {
	type = "number";
	isFiniteCheck = true;
};
var BigIntType = class extends BaseNumberType {
	type = "bigint";
	isFiniteCheck = false;
};

//#endregion
//#region src/api-builder/type-validators/params-definition.ts
var ParamsDefinition = class ParamsDefinition extends Type {
	requiredParams = 0;
	params = Kernel.Construct("Array");
	static From(context, params) {
		const def = new ParamsDefinition();
		if (context && params) for (const [i, param] of params.entries()) {
			const type = context.resolveType(param.type);
			const isOptional = typeof param.details?.default_value !== "undefined";
			const defaultValue = param.details?.default_value === "null" ? null : param.details?.default_value;
			const validRange = param.details && "max_value" in param.details && "min_value" in param.details ? {
				min: param.details.min_value,
				max: param.details.max_value
			} : undefined;
			const paramType = new ParamType(type, isOptional, defaultValue, validRange, i);
			def.addType(paramType);
		}
		return def;
	}
	constructor() {
		super();
	}
	addType(type) {
		if (this.params.length === this.requiredParams && !type.isOptional) {
			this.params.push(type);
			this.requiredParams = this.params.length;
		} else if (!type.isOptional) throw Kernel.Construct("TypeError", "Required parameter cannot be set after optional was defined");
else this.params.push(type);
		return this;
	}
	validate(diagnostics, params) {
		if (params.length > this.params.length || params.length < this.requiredParams) return diagnostics.report(API_ERRORS_MESSAGES.IncorrectNumberOfArguments({
			min: this.requiredParams,
			max: this.params.length
		}, params.length));
		for (let i = 0; i < this.params.length; i++) this.params[i]?.validate(diagnostics, params[i]);
		return diagnostics;
	}
};
var ParamType = class extends Type {
	constructor(type, isOptional, defaultValue, range, index = 0) {
		super();
		this.type = type;
		this.isOptional = isOptional;
		this.defaultValue = defaultValue;
		this.range = range;
		this.index = index;
	}
	validate(diagnostics, value) {
		if (this.isOptional) value ??= this.defaultValue;
		const typeDiagnostics = new DiagnosticsStackReport();
		this.type.validate(typeDiagnostics, value);
		if (this.type instanceof BaseNumberType && this.range) {
			if (value < this.range.min || value > this.range.max) diagnostics.report(API_ERRORS_MESSAGES.FunctionArgumentBounds(value, this.range, this.index));
		}
		return diagnostics.follow(typeDiagnostics);
	}
};

//#endregion
//#region src/api-builder/type-validators/types/boolean.ts
var BooleanType = class extends Type {
	validate(diagnostics, value) {
		if (typeof value !== "boolean") return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/class.ts
var ClassBindType = class extends Type {
	constructor(definition) {
		super();
		this.definition = definition;
	}
	validate(diagnostics, object) {
		if (!this.definition.isThisType(object)) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/function.ts
var FunctionType = class extends Type {
	validate(diagnostics, value) {
		if (typeof value !== "function") diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};
var GeneratorType = class extends Type {
	validate(diagnostics, value) {
		if (!isGeneratorObject(value)) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/interface.ts
var InterfaceBindType = class extends Type {
	properties = Kernel.Construct("Map");
	constructor(name, baseType = null) {
		super();
		this.name = name;
		this.baseType = baseType;
	}
	addProperty(name, type) {
		this.properties.set(name, type);
		return this;
	}
	validate(diagnostics, object) {
		if (typeof object !== "object" || object === null) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		const interfaceDiagnostics = new DiagnosticsStackReport();
		this.validateProperties(interfaceDiagnostics, object);
		if (!interfaceDiagnostics.isEmpty) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"), interfaceDiagnostics);
		return diagnostics;
	}
	validateProperties(diagnostics, object) {
		this.baseType?.validateProperties(diagnostics, object);
		for (const [propertyKey, type] of this.properties) type.validate(diagnostics, object[propertyKey]);
	}
};

//#endregion
//#region src/api-builder/type-validators/types/string.ts
var StringType = class extends Type {
	validate(diagnostics, value) {
		if (typeof value !== "string") diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/dynamic.ts
var DynamicType = class extends Type {
	type = null;
	validate(diagnostics, value) {
		if (!this.type) throw new ContextPanicError(PANIC_ERROR_MESSAGES.DynamicTypeNotResolved(""));
		this.type.validate(diagnostics, value);
		return diagnostics;
	}
	setType(type) {
		this.type = type;
	}
};

//#endregion
//#region src/api-builder/type-validators/index.ts
var type_validators_exports = {};
__export(type_validators_exports, {
	BaseNumberType: () => BaseNumberType,
	BigIntType: () => BigIntType,
	BooleanType: () => BooleanType,
	ClassBindType: () => ClassBindType,
	DynamicType: () => DynamicType,
	FunctionType: () => FunctionType,
	GeneratorType: () => GeneratorType,
	InterfaceBindType: () => InterfaceBindType,
	NumberType: () => NumberType,
	ParamType: () => ParamType,
	ParamsDefinition: () => ParamsDefinition,
	StringType: () => StringType,
	Type: () => Type,
	VoidType: () => VoidType,
	fromDefaultType: () => fromDefaultType,
	isDefaultType: () => isDefaultType,
	toDefaultType: () => toDefaultType
});

//#endregion
//#region src/api-builder/type-validators/types/array.ts
var ArrayType = class extends Type {
	constructor(type) {
		super();
		this.type = type;
	}
	validate(diagnostics, value) {
		if (!Kernel["Array::static"].isArray(value)) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		const elementsDiagnostics = new DiagnosticsStackReport();
		for (let i = 0; i < value.length; i++) this.type.validate(elementsDiagnostics, value[i]);
		if (elementsDiagnostics.isThrowable) diagnostics.report(API_ERRORS_MESSAGES.ArrayUnsupportedType(), elementsDiagnostics);
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/map.ts
var MapType = class extends Type {
	constructor(keyType, valueType) {
		super();
		this.keyType = keyType;
		this.valueType = valueType;
	}
	validate(diagnostics, map) {
		if (typeof map !== "object" || map === null) return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		const mapDiagnostics = new DiagnosticsStackReport();
		for (const key of Kernel.ArrayIterator(Kernel["Object::static"].keys(map))) {
			this.keyType.validate(mapDiagnostics, key);
			this.valueType.validate(mapDiagnostics, map[key]);
		}
		if (!mapDiagnostics.isEmpty) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/optional.ts
var OptionalType = class extends Type {
	constructor(type) {
		super();
		this.type = type;
	}
	validate(diagnostics, value) {
		if (value === undefined || value === null) return diagnostics;
		const optionals = new DiagnosticsStackReport();
		this.type.validate(optionals, value);
		if (optionals.isThrowable) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("optional type"), optionals);
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/promise.ts
var PromiseType = class extends Type {
	validate(diagnostics, value) {
		if (!isPromise(value)) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("type"));
		return diagnostics;
	}
};

//#endregion
//#region src/api-builder/type-validators/types/variant.ts
var VariantType = class extends Type {
	constructor(variants) {
		super();
		this.variants = variants;
	}
	validate(diagnostics, value) {
		const variants = new DiagnosticsStackReport();
		for (const variant of Kernel.ArrayIterator(this.variants)) {
			const s = new DiagnosticsStackReport();
			variant.validate(s, value);
			if (s.isEmpty) return diagnostics;
			variants.follow(s);
		}
		return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed("variant type"), variants);
	}
};

//#endregion
//#region src/api-builder/events.ts
/**

* Represents an event signal.

* - The types of the arguments passed to the event handlers.

*/
const SESSIONS = Kernel.Construct("WeakMap");
let ResultType = function(ResultType$1) {
	ResultType$1[ResultType$1["Warning"] = 0] = "Warning";
	ResultType$1[ResultType$1["Error"] = 1] = "Error";
	return ResultType$1;
}({});
var RunResult = class extends Kernel.Empty {
	constructor(method, type, value) {
		super();
		this.method = method;
		this.type = type;
		this.value = value;
	}
};
var InvokeResults = class extends Kernel.Empty {
	results = Kernel.Construct("Array");
	successCount = 0;
	totalCount = 0;
};
var NativeEvent = class extends Kernel.Empty {
	constructor() {
		super();
		SESSIONS.set(this, Kernel.Construct("Set", Kernel.Construct("Array")));
	}
	/**
	
	* Triggers the event signal.
	
	* @param params - The arguments to pass to the event handlers.
	
	* @returns A promise that resolves with the number of successful event handlers.
	
	*/
	invoke(...params) {
		const output = new InvokeResults();
		if (SESSIONS.has(this)) {
			const methods = SESSIONS.get(this);
			for (const method of Kernel.SetIterator(methods)) {
				output.totalCount++;
				try {
					if (method(...params) !== undefined) output.results.push(new RunResult(method, ResultType.Warning, `Method returned value, but return type should be void`));
					output.successCount++;
				} catch (error) {
					output.results.push(new RunResult(method, ResultType.Error, error));
				}
			}
		}
		return output;
	}
	/**
	
	* Subscribes to the event signal.
	
	* @template  k - The type of the event handler function.
	
	* @param method - The event handler function to subscribe.
	
	* @returns The subscribed event handler function.
	
	*/
	subscribe(method) {
		if (typeof method !== "function") throw new Kernel["TypeError::constructor"](`Expected a function, but got ${typeof method}.`);
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
		if (typeof method !== "function") throw new Kernel["TypeError::constructor"](`Expected a function, but got ${typeof method}.`);
		if (SESSIONS.has(this)) SESSIONS.get(this)?.delete(method);
		return method;
	}
};

//#endregion
//#region src/api-builder/context/execution-context.ts
var ConstructionExecutionContext = class extends Kernel.Empty {
	context;
	error = null;
	diagnostics = new Diagnostics();
	constructor(self, definition, methodId, parameters) {
		super();
		this.self = self;
		this.definition = definition;
		this.methodId = methodId;
		this.parameters = parameters;
		this.context = definition.context;
	}
	dispose() {
		if (!this.diagnostics.isEmpty) this.definition.context.reportDiagnostics(this.diagnostics);
		return 0;
	}
	throw(error) {
		this.error = error;
	}
};
var ExecutionContext = class extends ConstructionExecutionContext {
	resultHasBeenSet = false;
	result;
	constructor(self, definition, methodId, parameters, handle) {
		super(self, definition, methodId, parameters);
		this.handle = handle;
	}
	setResult(result) {
		Kernel.log("Result set: " + result);
		this.result = result;
		this.resultHasBeenSet = true;
	}
};

//#endregion
//#region src/api-builder/context/context-options.ts
const ContextOptions = {
	StrictReturnTypes: "StrictReturnTypes",
	GetterRequireValidBound: "GetterRequireValidBound"
};

//#endregion
//#region src/api-builder/context/factory/base.ts
function proxyify(method) {
	const final = new Kernel["globalThis::Proxy"](method, { apply(t, that, params) {
		return t(that, params);
	} });
	return final;
}
function finalize(method, length = 0) {
	Kernel.SetFakeNative(method);
	Kernel.SetLength(method, length);
	Kernel.SetName(method, "");
	return method;
}
function validateReturnType(executionContext, returnType) {
	const validate = executionContext.context.getConfigProperty(ContextOptions.StrictReturnTypes);
	Kernel.log(validate);
	returnType.validate(validate ? executionContext.diagnostics.errors : executionContext.diagnostics.warns, executionContext.result);
}

//#endregion
//#region src/api-builder/context/factory/method.ts
function createFunctionalMethod(paramsDefinition, returnType, contextFactory, trimStack = 0) {
	return (that, params) => {
		const executionContext = contextFactory(that, params);
		const { diagnostics, context, definition, methodId } = executionContext;
		if (!context.nativeHandles.has(that)) diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound("function", methodId));
		definition.type.validate(diagnostics.errors, that);
		paramsDefinition.validate(diagnostics.errors, executionContext.parameters);
		if (!diagnostics.success) {
			executionContext.dispose();
			throw diagnostics.throw(trimStack + 1);
		}
		definition.__call(executionContext);
		if (executionContext.error) throw executionContext.error.throw(trimStack + 1);
		validateReturnType(executionContext, returnType);
		executionContext.dispose();
		if (!diagnostics.success) throw diagnostics.throw(trimStack + 1);
		return executionContext.result;
	};
}
function createMethodFor(definition, name, paramsDefinition, returnType) {
	const id = `${definition.classId}::${name}`;
	const proxyThis = proxyify(createFunctionalMethod(paramsDefinition, returnType, (that, params) => new ExecutionContext(proxyThis, definition, id, Kernel.As(params, "Array"), that), 1));
	finalize(proxyThis, 0);
	return proxyThis;
}

//#endregion
//#region src/api-builder/context/factory/properties.ts
function createFunctionalSetter(type, contextFactory) {
	return (that, params) => {
		const executionContext = contextFactory(that, params);
		const { diagnostics, context, definition, methodId } = executionContext;
		if (!context.nativeHandles.has(that)) diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound("setter", methodId));
		type.validate(diagnostics.errors, params[0]);
		definition.type.validate(diagnostics.errors, that);
		if (!diagnostics.success) {
			executionContext.dispose();
			throw diagnostics.throw(2);
		}
		definition.__call(executionContext);
		if (executionContext.error) throw executionContext.error.throw(2);
		if (executionContext.result !== undefined) diagnostics.warns.report(ErrorFactory.New(WARNING_ERROR_MESSAGES.SettersShouldReturnUndefined(methodId), Kernel["TypeError::constructor"]));
		executionContext.dispose();
		if (!diagnostics.success) throw diagnostics.throw(2);
		return undefined;
	};
}
function createFunctionalGetter(type, contextFactory) {
	return (that, params) => {
		const executionContext = contextFactory(that, params);
		const { diagnostics, context, definition, methodId } = executionContext;
		if (!definition.context.nativeHandles.has(that)) diagnostics.errors.report(API_ERRORS_MESSAGES.NativeBound("getter", methodId));
		definition.type.validate(diagnostics.errors, that);
		if (!diagnostics.success) {
			executionContext.dispose();
			if (!definition.context.getConfigProperty(ContextOptions.GetterRequireValidBound)) return undefined;
			throw diagnostics.throw(2);
		}
		definition.__call(executionContext);
		if (executionContext.error) throw executionContext.error.throw(2);
		validateReturnType(executionContext, type);
		executionContext.dispose();
		if (!diagnostics.success) throw diagnostics.throw(2);
		return executionContext.result;
	};
}
function createSetterFor(definition, name, paramType) {
	const id = `${definition.classId}::${name} setter`;
	const proxyThis = proxyify(createFunctionalSetter(paramType, (that, params) => new ExecutionContext(proxyThis, definition, id, Kernel.As(params, "Array"), that)));
	finalize(proxyThis, 1);
	return proxyThis;
}
function createGetterFor(definition, name, type) {
	const id = `${definition.classId}::${name} getter`;
	const proxyThis = proxyify(createFunctionalGetter(type, (that, params) => new ExecutionContext(proxyThis, definition, id, Kernel.As(params, "Array"), that)));
	finalize(proxyThis, 0);
	return proxyThis;
}

//#endregion
//#region src/api-builder/context/factory/function.ts
function createFunctionalFunction(paramsDefinition, returnType, contextFactory, trimStack = 0) {
	return (that, params) => {
		const executionContext = contextFactory(params);
		const { diagnostics, context, methodId } = executionContext;
		paramsDefinition.validate(diagnostics.errors, executionContext.parameters);
		if (!diagnostics.success) {
			executionContext.dispose();
			throw diagnostics.throw(trimStack + 1);
		}
		if (executionContext.error) throw executionContext.error.throw(trimStack + 1);
		validateReturnType(executionContext, returnType);
		executionContext.dispose();
		if (!diagnostics.success) throw diagnostics.throw(trimStack + 1);
		return executionContext.result;
	};
}
function createFunction(fullId, paramsDefinition, returnType) {
	const id = fullId;
	const proxyThis = proxyify(createFunctionalFunction(
		paramsDefinition,
		returnType,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(params) => new ExecutionContext(proxyThis, null, id, Kernel.As(params, "Array"), null)
));
	finalize(proxyThis, 0);
	return proxyThis;
}

//#endregion
//#region src/api-builder/context/factory/constructor.ts
function createFunctionalConstructor(paramsDefinition, contextFactory, trimStack = 0) {
	return function ctor() {
		const params = arguments;
		const executionContext = contextFactory(params);
		const { definition, diagnostics } = executionContext;
		if (!new.target && definition.newExpected) diagnostics.errors.report(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());
		if (!definition.hasConstructor) diagnostics.errors.report(API_ERRORS_MESSAGES.NoConstructor(definition.classId));
		paramsDefinition.validate(diagnostics.errors, executionContext.parameters);
		if (!diagnostics.success) {
			executionContext.dispose();
			throw diagnostics.throw(trimStack + 1);
		}
		const result = Kernel.__setPrototypeOf(definition.__construct(executionContext)[0], new.target?.prototype ?? definition.api.prototype);
		if (executionContext.error) throw executionContext.error.throw(trimStack + 1);
		executionContext.dispose();
		if (!diagnostics.success) throw diagnostics.throw(trimStack + 1);
		return result;
	};
}
function createConstructorFor(definition, paramsDefinition) {
	const ctor = createFunctionalConstructor(paramsDefinition, (params) => new ConstructionExecutionContext(ctor, definition, `${definition.classId}::constructor`, Kernel.As(params, "Array")), 0);
	ctor.prototype = { constructor: ctor };
	const parent = definition.parent;
	if (parent) {
		Kernel.__setPrototypeOf(ctor, parent.api);
		Kernel.__setPrototypeOf(ctor.prototype, parent.api.prototype);
	}
	Kernel.SetClass(ctor, definition.classId);
	return ctor;
}

//#endregion
//#region src/api-builder/context/factory/index.ts
var factory_exports = {};
__export(factory_exports, {
	createConstructorFor: () => createConstructorFor,
	createFunction: () => createFunction,
	createGetterFor: () => createGetterFor,
	createMethodFor: () => createMethodFor,
	createSetterFor: () => createSetterFor
});

//#endregion
//#region src/api-builder/context/class-definition.ts
var ClassDefinition = class extends Kernel.Empty {
	HANDLE_TO_NATIVE_CACHE = Kernel.Construct("WeakMap");
	NATIVE_TO_HANDLE_CACHE = Kernel.Construct("WeakMap");
	virtualApis = Kernel.Construct("Map");
	onConstruct;
	constructorId;
	type;
	hasConstructor;
	invocable = Kernel.Construct("WeakMap");
	addInvocable(id, method) {
		this.virtualApis.set(id, method);
		const event = new NativeEvent();
		this.invocable.set(method, event);
		this.context.nativeEvents.set(id, event);
	}
	/**
	
	* TODO: Improve the types tho
	
	*/
	api;
	getAPIMethod(name) {
		return this.virtualApis.get(`${this.classId}::${name.toString()}`);
	}
	/**
	
	*
	
	* @param classId Fake API Class Name
	
	* @param parent Inject inheritance
	
	*/
	constructor(context, classId, parent, constructorParams, newExpected = true) {
		super();
		this.context = context;
		this.classId = classId;
		this.parent = parent;
		this.constructorParams = constructorParams;
		this.newExpected = newExpected;
		this.hasConstructor = Kernel["Boolean::constructor"](constructorParams);
		this.api = createConstructorFor(this, constructorParams ?? new ParamsDefinition());
		this.constructorId = `${classId}:constructor`;
		if (context.nativeEvents.has(this.constructorId)) throw new Kernel["ReferenceError::constructor"](`Class with this id already exists '${classId}'`);
		context.nativeEvents.set(this.constructorId, this.onConstruct = new NativeEvent());
		this.virtualApis.set(this.constructorId, this.api);
		context.registerType(classId, this.type = new ClassBindType(this));
	}
	/**
	
	*
	
	* @returns New Virtual API Instance of the handle
	
	*/
	create() {
		const [handle] = Kernel.ArrayIterator(this.__construct(new ConstructionExecutionContext(null, this, this.classId, Kernel.Construct("Array"))));
		return Kernel.__setPrototypeOf(handle, this.api.prototype);
	}
	/**
	
	* If specific handle is type of this definition
	
	*/
	isThisType(handle) {
		return this.HANDLE_TO_NATIVE_CACHE.has(handle);
	}
	addMethod(name, params = new ParamsDefinition(), returnType = new VoidType()) {
		const method = this.api.prototype[name] = createMethodFor(this, name, params, returnType);
		const id = `${this.classId}::${name}`;
		this.addInvocable(id, method);
		return this;
	}
	addProperty(name, type, isReadonly) {
		const getter = createGetterFor(this, name, type);
		const setter = isReadonly ? undefined : createSetterFor(this, name, type);
		Kernel.__defineProperty(this.api.prototype, name, {
			configurable: true,
			enumerable: true,
			get: getter,
			set: setter
		});
		this.addInvocable(`${this.classId}::${name} getter`, getter);
		if (setter) this.addInvocable(`${this.classId}::${name} setter`, setter);
		return this;
	}
	addStaticFunction(name, params = new ParamsDefinition(), returnType = new VoidType()) {
		return this;
	}
	addStaticConstant(name, type, isReadonly, defaultValue) {
		Kernel.warn(new ContextPanicError(PANIC_ERROR_MESSAGES.NoImplementation));
		return this;
	}
	/**
	
	*
	
	* @param params IArguments passed by api context, unpredictable but type safe
	
	* @returns handle and cache pair
	
	*/
	__construct(context) {
		let data = this.parent?.__construct(context);
		if (!data) data = Kernel.Construct("Array", Kernel.__create(null), Kernel.__create(null));
		const [handle, cache] = Kernel.ArrayIterator(data);
		this.context.nativeHandles.add(handle);
		this.HANDLE_TO_NATIVE_CACHE.set(handle, cache);
		this.NATIVE_TO_HANDLE_CACHE.set(cache, handle);
		const results = this.onConstruct.invoke(handle, cache, this, context);
		if (results.successCount !== results.totalCount) {}
		return data;
	}
	__call(context) {
		if (context.self) {
			const event = this.invocable.get(context.self);
			if (event) {
				const result = event.invoke(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					context.handle,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					this.HANDLE_TO_NATIVE_CACHE.get(context.handle),
					this,
					context
);
				if (result.successCount !== result.totalCount) Kernel.log(result);
			}
		}
	}
};

//#endregion
//#region src/api-builder/context/context.ts
var Context = class extends Kernel.Empty {
	TYPES = Kernel.Construct("Map");
	UNRESOLVED_TYPES = Kernel.Construct("Map");
	OPTIONS = {
		StrictReturnTypes: true,
		GetterRequireValidBound: false
	};
	setConfigProperty(key, value) {
		this.OPTIONS[key] = value;
	}
	getConfigProperty(key) {
		return this.OPTIONS[key];
	}
	/**
	
	* Register new type
	
	* @param name
	
	* @param type
	
	*/
	registerType(name, type) {
		this.TYPES.set(name, type);
	}
	/**
	
	* Get dynamic type that will resolve once this.resolveAll is called
	
	* @param name
	
	* @returns
	
	*/
	getDynamicType(name) {
		let dynamicType = this.UNRESOLVED_TYPES.get(name);
		if (!dynamicType) this.UNRESOLVED_TYPES.set(name, dynamicType = new DynamicType());
		return dynamicType;
	}
	/**
	
	* Tries to resolve all unresolved types
	
	*/
	resolveAllDynamicTypes() {
		for (const typeName of this.UNRESOLVED_TYPES.keys()) {
			const resolvedType = this.TYPES.get(typeName);
			if (!resolvedType) continue;
			const unresolvedType = this.UNRESOLVED_TYPES.get(typeName);
			unresolvedType.setType(resolvedType);
			this.UNRESOLVED_TYPES.delete(typeName);
		}
		for (const typeName of this.UNRESOLVED_TYPES.keys()) Kernel.warn("Failed to resolve dynamic type: " + typeName);
	}
	resolveType(metadataType) {
		const { name } = metadataType;
		if (metadataType.is_bind_type) {
			const type = this.TYPES.get(name);
			if (type) return type;
			const dynamicBindType = this.getDynamicType(metadataType.name);
			if (!dynamicBindType) throw Kernel["ReferenceError::constructor"]("resolveType - Unknown bind type: " + name);
			return dynamicBindType;
		}
		switch (name) {
			case "uint8":
			case "int8":
			case "uint16":
			case "int16":
			case "uint32":
			case "int32":
			case "float":
			case "double": return new NumberType(metadataType.valid_range);
			case "uint64":
			case "int64": return new BigIntType(metadataType.valid_range);
			case "boolean": return new BooleanType();
			case "string": return new StringType();
			case "closure": return new FunctionType();
			case "variant": return new VariantType(metadataType.variant_types.map((e) => this.resolveType(e)));
			case "optional": return new OptionalType(this.resolveType(metadataType.optional_type));
			case "undefined": return new VoidType();
			case "array": return new ArrayType(this.resolveType(metadataType.element_type));
			case "map": return new MapType(this.resolveType(metadataType.key_type), this.resolveType(metadataType.value_type));
			case "promise": return new PromiseType();
			case "generator": return new GeneratorType();
			case "this":
			case "iterator":
			default: throw new Kernel["ReferenceError::constructor"](`resolveType - Unknown type: ${name}`);
		}
	}
	nativeHandles = Kernel.Construct("WeakSet");
	nativeEvents = Kernel.Construct("Map");
	onInvocation(eventName, callBack) {
		const event = this.nativeEvents.get(eventName);
		if (!event) throw new Kernel["ReferenceError::constructor"](`Unknown methodId specified: ${eventName}`);
		event.subscribe(callBack);
	}
	isHandleNative(handle) {
		return this.nativeHandles.has(handle);
	}
	createClassDefinition(name, parent, paramDefinition, newExpected = true) {
		return new ClassDefinition(this, name, parent, paramDefinition, newExpected);
	}
	reportDiagnostics(diagnostics) {
		Kernel.log("TODO: ", "implement: " + this.reportDiagnostics.name);
	}
};

//#endregion
//#region src/api-builder/index.ts
const CONTEXT = new Context();

//#endregion
export { factory_exports as APIFactory, CONTEXT, ClassDefinition, ContextOptions as ConfigContextOptions, Kernel, type_validators_exports as Types };