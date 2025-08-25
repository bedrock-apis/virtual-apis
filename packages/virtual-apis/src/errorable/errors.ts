import type { Range } from '@bedrock-apis/types';

//#region Factory
export type ErrorConstructor = new (message: string) => Error;
export class ErrorFactory {
   public static new<T extends new (message?: string, type?: ErrorConstructor) => ErrorFactory>(
      this: T,
      message?: string,
      type?: ErrorConstructor,
   ) {
      return new this(message, type);
   }
   public readonly message?: string;
   public readonly type?: ErrorConstructor;
   public constructor(message?: string, type?: ErrorConstructor) {
      this.message = message;
      this.type = type;
   }
   public getErrorConstructor(): ErrorConstructor {
      return this.type ?? Error;
   }
   public getMessage(): string {
      return this.message ?? 'Default Base Error Message';
   }
}
//#endregion

//#region Custom Errors
export class ContextPanicError extends Error {
   public constructor(message: string) {
      super(message);
   }
}
export class CompileTimeError extends SyntaxError {}

export class NumberErrorFactory extends ErrorFactory {
   public constructor(
      message: string,
      type: ErrorConstructor,
      public readonly text: unknown,
   ) {
      super(message + text, type);
   }
}
//#endregion

//#region Error Constants

export type NativeKind = 'function' | 'getter' | 'setter' | 'constructor' | 'property';
export type NativeActionKind = 'call' | 'get' | 'set';
export type NativeTypeKind = 'optional type' | 'variant type' | 'type';

export const ERROR_TYPE = Error;
export const REFERENCE_ERROR_TYPE = ReferenceError;
export const TYPE_ERROR_TYPE = TypeError;

// TODO Resolve it
class ArgumentOutOfBoundsError extends Error {
   public override name: string = 'ArgumentOutOfBoundsError';
}

// Custom type errors: ArgumentOutOfBoundsError: Provided integer value was out of range.  Value: -3000000000, argument bounds: [-2147483648, 2147483647]
// `Unsupported or out of bounds value passed to function argument [${argument}]. Value: ${value}, argument bounds: [${range.min}, ${range.max}]`
export const WARNING_ERROR_MESSAGES = {
   SettersShouldReturnUndefined: (id: string) => 'Result should be always undefined for property setter methods: ' + id,
};
export const PANIC_ERROR_MESSAGES = {
   EmptyDiagnosticsStackInstance: `Failed to throw report error on empty DiagnosticsStack instance.`,
   NoImplementation: `No implementation error.`,
   DynamicTypeNotResolved: (data: unknown) => `Failed to call validate on unresolved DynamicType ${data}`,
};
export const QUICK_JS_ENV_ERROR_MESSAGES = {
   NewExpected: () => ErrorFactory.new(`must be called with new`), // TypeError
};
export const API_ERRORS_MESSAGES = {
   NoConstructor: (id: string) => ErrorFactory.new(`No constructor for native class '${id}'.`, REFERENCE_ERROR_TYPE),
   NoPrivilege: (kind: NativeKind, id: string) =>
      ErrorFactory.new(`Native ${kind} [${id}] does not have required privileges.`, TYPE_ERROR_TYPE),
   NativeBound: (kind: NativeKind, id: string) =>
      ErrorFactory.new(`Native ${kind} [${id}] object bound to prototype does not exist.`, REFERENCE_ERROR_TYPE),
   NativeConversionFailed: (type: NativeTypeKind, additional?: string) =>
      ErrorFactory.new(`Native ${type} conversion failed.${additional ?? ''}`, TYPE_ERROR_TYPE), //Type error
   ObjectHasInvalidHandle: () => ErrorFactory.new(`Object has an invalid native handle.`, TYPE_ERROR_TYPE), // Type Error
   ObjectDidNotHaveHandle: () => ErrorFactory.new(`Object did not have a native handle.`, TYPE_ERROR_TYPE), // Type Error
   ArrayUnsupportedType: () => ErrorFactory.new(`Array contains unsupported type.`, TYPE_ERROR_TYPE), // Type Error
   ValueNotSupported: (value: string) => ErrorFactory.new(`${value} value is not supported.`, TYPE_ERROR_TYPE),
   FailedTo: (action: NativeActionKind, kind: NativeKind, name: string) =>
      ErrorFactory.new(`Failed to ${action} ${kind} '${name}'`, ERROR_TYPE),
   InvalidTimeOfDay: (min = 0, max = 23999) =>
      ErrorFactory.new(`timeOfDay must be between ${min} and ${max} (inclusive)`, TYPE_ERROR_TYPE),
   IncorrectNumberOfArguments: (t: Range<number, number>, length: number) =>
      ErrorFactory.new(
         `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
         TYPE_ERROR_TYPE,
      ),

   OutOfRange(value: unknown, range: Range<unknown, unknown>) {
      // mc stores numbers that are bigger then int32 as something with .00 at the end lol
      const correctValue =
         typeof value === 'number' && (value > 2147483648 || value < -2147483648) ? value.toFixed(2) : value;

      return new NumberErrorFactory(
         `Provided integer value was out of range.  `, // Note double space
         ArgumentOutOfBoundsError,
         `Value: ${correctValue}, Argument bounds: [${range.min}, ${range.max}]`,
      );
   },

   /* ItemStack */
   ItemTypeDoesNotExist: (itemType: string) => ErrorFactory.new(`ItemType '${itemType}' does not exists`),
};
//#endregion

/*
export type KernelLike = {
   [K in keyof typeof Kernel as K extends `${string}::constructor`
      ? (typeof Kernel)[K] extends new () => Error
         ? K
         : never
      : never]: (typeof Kernel)[K];
};
//export type ErrorFactory<T extends unknown[]> = (...params: T) => string;
function e<T extends unknown[]>(s: TemplateStringsArray, constructor: keyof KernelLike, ...params: T) {
   return {
      constructorId: constructor,
      getMessage: (...params: T) => {
         const newArray = Kernel.call(Kernel['Array::prototype'].map, s, (e: string, i: number) => e + params[i]);
         return Kernel.call(Kernel['Array::prototype'].join, newArray);
      },
   };
}
function t<T>(): T {
   return null as T;
}*/
