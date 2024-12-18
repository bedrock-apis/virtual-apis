import type { Range } from '../../script-module-metadata';

export type NativeKind = 'function' | 'getter' | 'setter' | 'constructor' | 'property';
export type NativeActionKind = 'call' | 'get' | 'set';
export type NativeTypeKind = 'optional type' | 'variant type' | 'type';

// Custom type errors: ArgumentOutOfBoundsError: Provided integer value was out of range.  Value: -3000000000, argument bounds: [-2147483648, 2147483647]
// `Unsupported or out of bounds value passed to function argument [${argument}]. Value: ${value}, argument bounds: [${range.min}, ${range.max}]`
export const WARNING_ERROR_MESSAGES = {
   SettersShouldReturnUndefined: (id: string) => 'Result should be always undefined for property setter methods: ' + id,
};
export const PANIC_ERROR_MESSAGES = {
   EmptyDiagnosticsStackInstance: `Failed to throw report error on empty DiagnosticsStack instance.`,
   NoImplementation: `No implementation error.`,
   DynamicTypeNotResolved: `Failed to call validate on unresolved DynamicType`,
};
export const QUICK_JS_ENV_ERROR_MESSAGES = {
   NewExpected: () => `must be called with new`, // TypeError
};
export const API_ERRORS_MESSAGES = {
   NoConstructor: (id: string) => `No constructor for native class '${id}'.`, // Reference Error
   NoPrivilege: (kind: NativeKind, id: string) => `Native ${kind} [${id}] does not have required privileges.`, // Type Error
   NativeBound: (kind: NativeKind, id: string) => `Native ${kind} [${id}] object bound to prototype does not exist.`,
   NativeConversionFailed: (type: NativeTypeKind) => `Native ${type} conversion failed.`, //Type error
   ObjectHasInvalidHandle: () => `Object has an invalid native handle.`, // Type Error
   ObjectDidNotHaveHandle: () => `Object did not have a native handle.`, // Type Error
   ArrayUnsupportedType: () => `Array contains unsupported type.`, // Type Error
   ValueNotSupported: (value: string) => `${value} value is not supported.`,
   FailedTo: (action: NativeActionKind, kind: NativeKind, name: string) => `Failed to ${action} ${kind} '${name}'`,
   InvalidTimeOfDay: (min = 0, max = 23999) => `timeOfDay must be between ${min} and ${max} (inclusive)`,
   IncorrectNumberOfArguments: (t: Range<number, number>, length: number) =>
      `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
   FunctionArgumentExpectedType: (error: string, argument: number, type: string) =>
      `${error} Function argument [${argument}] expected type: ${type}`,

   // TODO Somehow resolve ArgumentOutOfBoundsError
   FunctionArgumentBounds: (value: unknown, range: Range<unknown, unknown>, argument: number) =>
      `Unsupported or out of bounds value passed to function argument [${argument}]. Value: ${value}, argument bounds: [${range.min}, ${range.max}]`,

   OutOfRange: (value: unknown, range: Range<unknown, unknown>) =>
      `Provided integer value was out of range.  Value: ${value}, argument bounds: [${range.min}, ${range.max}]`,

   /* ItemStack */
   ItemTypeDoesNotExist: (itemType: string) => `ItemType '${itemType}' does not exists`,
   InvalidAmount: (min = 0, max = 256) => `Invalid amount. Amount must be greater than ${min} and less than ${max}`,
};
