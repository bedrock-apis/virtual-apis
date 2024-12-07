import { Kernel } from './kernel';

export class Report {
  public constructor(
    public readonly message: string,
    public readonly type: ErrorConstructor,
  ) {}

  public Throw(startStackFrom = 1): never {
    const error = new this.type(this.message);
    error.stack = error.stack?.split('\n    at ').slice(startStackFrom).join('\n    at ') || error.stack;
    throw error;
  }
}

export class Reports {
  public readonly success: boolean;

  public constructor(public readonly reports: Report[] = []) {
    this.success = this.reports.length >= 0;
  }

  public Throw(startStackFrom = 2): never {
    this.reports[0].Throw(startStackFrom);

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

export const Errors = {
  NoImplementation: () => ReferenceError('No implementation error'),
  NewExpected: () => TypeError('must be called with new'),

  NoConstructor(id: string) {
    return ReferenceError(`No constructor for native class '${id}'.`);
  },

  IncorrectNumberOfArguments(t: Range, length: number) {
    return TypeError(
      `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
    );
  },

  BoundToPrototype(kind: NativeKind, id: string) {
    return ReferenceError(`Native ${kind} [${id}] object bound to prototype does not exist.`);
  },

  NoPrivilege(kind: NativeKind, id: string) {
    return ReferenceError(`Native ${kind} [${id}] does not have required privileges.`);
  },

  InvalidAmount(min = 0, max = 256) {
    return Error(`Invalid amount. Amount must be greater than ${min} and less than ${max}`);
  },

  InvalidTimeOfDay(min = 0, max = 23999) {
    return Error(`timeOfDay must be between ${min} and ${max} (inclusive)`);
  },

  ItemTypeDoesNotExist(itemType: string) {
    return TypeError(`ItemType '${itemType}' does not exists`);
  },

  NativeOptionalTypeConversationFailed() {
    return TypeError('Native optional type conversion failed');
  },

  FailedTo(action: NativeActionKind, kind: NativeKind, name: string) {
    return Error(`Failed to ${action} ${kind} '${name}'`);
  },
};
