import { Kernel } from './kernel';

export class Report {
   public constructor(
      public readonly message: string,
      public readonly type: new (message: string) => Error,
   ) {}

   public throw(startStackFrom = 1): never {
      const error = new this.type(this.message);
      error.stack = error.stack?.split('\n    at ').slice(startStackFrom).join('\n    at ') || error.stack;
      throw error;
   }
}

export class Diagnostics {
   public get success() {
      return this.errors.length === 0;
   }
   public readonly errors = Kernel.Construct('Array') as Report[];
   public readonly warns = Kernel.Construct('Array') as Report[];
   public report<T extends string | Report>(
      ...params: T extends string ? [message: T, errorType: Report['type']] : [report: T]
   ): this {
      // Avoid using push as push is not isolated
      this.errors[this.errors.length] =
         typeof params[0] === 'string' ? new Report(params[0], params[1] as Report['type']) : params[0];
      return this;
   }
   public throw(startStackFrom = 2): never {
      this.errors[0].throw(startStackFrom + 1);

      // Impossible to reach actually
      throw Kernel.Construct('Error', 'Failed to throw report error');
   }
}

export type Range = { min: number; max: number };
export type NativeKind = 'function' | 'getter' | 'setter' | 'constructor';
export type NativeActionKind = 'call' | 'get' | 'set';

const TypeError = (message: string) => new Report(message, Kernel.Constructor('TypeError'));
const ReferenceError = (message: string) => new Report(message, Kernel.Constructor('ReferenceError'));
const Error = (message: string) => new Report(message, Kernel.Constructor('Error'));

// Custom type errors: ArgumentOutOfBoundsError: Provided integer value was out of range.  Value: -3000000000, argument bounds: [-2147483648, 2147483647]

export const ERRORS = {
   NoImplementation: ReferenceError('No implementation error'),
   NewExpected: TypeError('must be called with new'),
   NativeTypeConversationFailed: TypeError('Native type conversion failed.'),
   NativeOptionalTypeConversationFailed: TypeError('Native optional type conversion failed'),
   NoConstructor: (id: string) => ReferenceError(`No constructor for native class '${id}'.`),
   ValueIsNotSupported: (value: 'Infinity' | 'NaN') => TypeError(`${value} value is not supported.`),

   BoundToPrototype(kind: NativeKind, id: string) {
      return ReferenceError(`Native ${kind} [${id}] object bound to prototype does not exist.`);
   },

   NoPrivilege(kind: NativeKind, id: string) {
      return ReferenceError(`Native ${kind} [${id}] does not have required privileges.`);
   },

   InvalidTimeOfDay(min = 0, max = 23999) {
      return Error(`timeOfDay must be between ${min} and ${max} (inclusive)`);
   },

   FailedTo(action: NativeActionKind, kind: NativeKind, name: string) {
      return Error(`Failed to ${action} ${kind} '${name}'`);
   },

   /* Function */
   IncorrectNumberOfArguments(t: Range, length: number) {
      return TypeError(
         `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
      );
   },

   FunctionArgumentExpectedType(error: string, argument: number, type: string) {
      return TypeError(`${error} Function argument [${argument}] expected type: ${type}`);
   },

   /* ItemStack */
   ItemTypeDoesNotExist: (itemType: string) => TypeError(`ItemType '${itemType}' does not exists`),
   InvalidAmount(min = 0, max = 256) {
      return Error(`Invalid amount. Amount must be greater than ${min} and less than ${max}`);
   },
};
