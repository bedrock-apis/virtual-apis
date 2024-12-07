import { Kernel } from './kernel';

export type Range = { min: number; max: number };
export type NativeKind = 'function' | 'getter' | 'setter' | 'constructor';
export type NativeActionKind = 'call' | 'get' | 'set';

const TypeError = Kernel.Constructor('TypeError');
const ReferenceError = Kernel.Constructor('ReferenceError');
const Error = Kernel.Constructor('Error');

export const Errors = {
  NewExpected() {
    return new TypeError('must be called with new');
  },

  NoConstructor(id: string) {
    return new ReferenceError(`No constructor for native class '${id}'.`);
  },

  IncorrectNumberOfArguments(t: Range, length: number) {
    return new TypeError(
      `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
    );
  },

  BoundToPrototype(kind: NativeKind, id: string) {
    return new ReferenceError(`Native ${kind} [${id}] object bound to prototype does not exist.`);
  },

  NoPrivilege(kind: NativeKind, id: string) {
    return new ReferenceError(`Native ${kind} [${id}] does not have required privileges.`);
  },

  InvalidAmount(min = 0, max = 256) {
    return new Error(`Invalid amount. Amount must be greater than ${min} and less than ${max}`);
  },

  InvalidTimeOfDay(min = 0, max = 23999) {
    return new Error(`timeOfDay must be between ${min} and ${max} (inclusive)`);
  },

  ItemTypeDoesNotExist(itemType: string) {
    return new TypeError(`ItemType '${itemType}' does not exists`);
  },

  NativeOptionalTypeConversationFailed() {
    return new TypeError('Native optional type conversion failed');
  },

  FailedTo(action: NativeActionKind, kind: NativeKind, name: string) {
    return new Error(`Failed to ${action} ${kind} '${name}'`);
  },
};
