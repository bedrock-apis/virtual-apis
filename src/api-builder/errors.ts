import { Kernel } from './kernel';

export type Range = { min: number; max: number };
export type NativeKind = 'function' | 'getter' | 'setter' | 'constructor';

export const Errors = {
  NewExpected() {
    return Kernel.Construct('TypeError', true, 'must be called with new');
  },

  NoConstructor(id: string) {
    return Kernel.Construct('ReferenceError', true, `No constructor for native class '${id}'.`);
  },

  IncorrectNumberOfArguments(t: Range, length: number) {
    return Kernel.Construct(
      'TypeError',
      true,
      `Incorrect number of arguments to function. Expected ${t.min === t.max ? t.min : `${t.min}-${t.max}`}, received ${length}`,
    );
  },

  BoundToPrototype(kind: NativeKind, id: string) {
    return Kernel.Construct('ReferenceError', true, `Native ${kind} [${id}] object bound to prototype does not exist.`);
  },

  NoPrivilege(kind: NativeKind, id: string) {
    return Kernel.Construct('ReferenceError', true, `Native ${kind} [${id}] does not have required privileges.`);
  },

  InvalidAmount(min = 0, max = 256) {
    return Kernel.Construct('Error', true, `Invalid amount. Amount must be greater than ${min} and less than ${max}`);
  },

  InvalidTimeOfDay(min = 0, max = 23999) {
    return Kernel.Construct('Error', true, `timeOfDay must be between ${min} and ${max} (inclusive)`);
  },
};
