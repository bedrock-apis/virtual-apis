/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable custom/no-globals */

const __create = Object.create;
const __definitions = Object.getOwnPropertyDescriptors;

type GlobalConstructorKeys = {
  [K in keyof typeof globalThis]: (typeof globalThis)[K] extends new (...args: any) => any ? K : never;
}[keyof typeof globalThis];

type KernelType = {
  [K in GlobalConstructorKeys as `${K}::constructor`]: (typeof globalThis)[K];
} & {
  [K in GlobalConstructorKeys as `${K}::prototype`]: (typeof globalThis)[K]['prototype'];
} & {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in GlobalConstructorKeys as `${K}::static`]: Omit<(typeof globalThis)[K], keyof Function>;
} & {
  [K in keyof typeof globalThis as `globalThis::${K}`]: (typeof globalThis)[K];
};
class KernelClass {
  public static __call: CallableFunction['call'] = Function.prototype.call; // Type to Type call method
  public static call = Function.prototype.call.bind(Function.prototype.call);
  public static __setPrototypeOf = Object.setPrototypeOf;
  public static __defineProperty = Object.defineProperty;
  public static __create = Object.create;
  public static Construct<T extends GlobalConstructorKeys, S extends (typeof globalThis)[T]>(
    name: T,
    useNew?: boolean,
  ): S extends { new (): infer I } | { (): infer I } ? I : never;
  public static Construct<T extends GlobalConstructorKeys, S extends (typeof globalThis)[T]>(
    name: T,
    useNew?: boolean,
    ...args: S extends { new (...params: infer I): unknown } | { (...params: infer I): infer I } ? I : []
  ): S extends { new (): infer I } | { (): infer I } ? I : never;
  public static Construct<T extends GlobalConstructorKeys, S extends (typeof globalThis)[T]>(
    name: T,
    useNew = true,
    ...args: unknown[]
  ): S extends { new (): infer I } | { (): infer I } ? I : never {
    console.log(name);
    if (useNew)
      return KernelClass.__setPrototypeOf(
        new KernelStorage[name + '::constructor'](...args),
        KernelStorage[name + '::prototype'],
      );
    else
      return KernelClass.__setPrototypeOf(
        KernelStorage[name + '::constructor'](...args),
        KernelStorage[name + '::prototype'],
      );
  }

  public static As<T extends keyof typeof globalThis>(
    object: unknown,
    name: T,
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never {
    return KernelClass.__setPrototypeOf(object, KernelStorage[name + '::prototype']);
  }

  public static Constructor<T extends keyof typeof globalThis>(name: T) {
    return KernelStorage[name + '::constructor'] as (typeof globalThis)[T] extends { new (): void } | { (): void }
      ? (typeof globalThis)[T]
      : never;
  }

  public static Prototype<T extends keyof typeof globalThis>(
    name: T,
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never {
    return KernelStorage[name + '::prototype'];
  }

  public Static<T extends keyof typeof globalThis>(
    name: T,
  ): (typeof globalThis)[T] extends { new (): void } | { (): void }
    ? { [key in keyof (typeof globalThis)[T]]: (typeof globalThis)[T][key] }
    : never {
    return KernelStorage[name + '::public static '];
  }

  public static SetName<T extends CallableFunction>(func: T, name: string): T {
    KernelClass.__defineProperty(func, 'name', {
      value: name,
      enumerable: false,
      configurable: true,
      writable: false,
    });
    return func;
  }

  public static SetLength<T extends CallableFunction>(func: T, length: number): T {
    KernelClass.__defineProperty(func, 'length', {
      value: length,
      enumerable: false,
      configurable: true,
      writable: false,
    });
    return func;
  }

  public static SetClass<T extends CallableFunction>(func: T, name: string): T {
    KernelClass.SetName(func, name);
    KernelClass.SetFakeNative(func);
    return KernelClass.LockPrototype(func);
  }

  public static LockPrototype<T extends CallableFunction>(func: T): T {
    KernelClass.__defineProperty(func, 'prototype', {
      value: func.prototype,
      enumerable: false,
      configurable: false,
      writable: false,
    });
    return func;
  }

  public static SetFakeNative<T extends CallableFunction>(func: T): void {
    if (typeof func === 'function') $native_functions.add(func);
  }

  public static IsFakeNative<T extends CallableFunction>(func: T): boolean {
    if (typeof func === 'function') return $native_functions.has(func);
    else return false;
  }
  public static SetGlobalThis() {}
  public static IsolatedCopy<T extends object>(obj: T): T {
    return __create(null, __definitions(obj));
  }
  public static log = console.log;
  public static error = console.error;
  public static warn = console.warn;
}

const KernelStorage = KernelClass as unknown as Record<string, any>;
KernelClass.__setPrototypeOf(KernelStorage, null);

const globalNames = Object.getOwnPropertyNames(globalThis);

for (const constructor of globalNames
  .map(k => (globalThis as typeof KernelStorage)[k])
  .filter(v => typeof v === 'function' && v.prototype)) {
  KernelStorage[constructor.name + '::constructor'] = constructor;
  KernelStorage[constructor.name + '::prototype'] = KernelClass.IsolatedCopy(constructor.prototype);
  KernelStorage[constructor.name + '::static'] = KernelClass.IsolatedCopy(constructor);
}
for (const globalName of globalNames) {
  KernelStorage[`globalThis::${globalName}`] = globalThis[globalName as keyof typeof globalThis];
}

const $native_functions = KernelClass.Construct('WeakSet');
$native_functions.add(
  (Function.prototype.toString = function () {
    if ($native_functions.has(this) && typeof this === 'function')
      return `function ${this.name}() {\n    [native code]\n}`;
    const string = KernelClass.As(KernelClass.call(KernelStorage['Function::prototype'].toString, this), 'String');
    return string + '';
  }),
);

export const Kernel = KernelClass as typeof KernelClass & KernelType;
