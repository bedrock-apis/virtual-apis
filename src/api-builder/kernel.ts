export class Kernel {
  public static __call: CallableFunction['call'] = Function.prototype.call; // Type to Type call method
  public static call = Function.prototype.call.bind(Function.prototype.call);
  public static __setPrototypeOf = Object.setPrototypeOf;
  public static __defineProperty = Object.defineProperty;
  public static __create = Object.create;
  public static Construct<T extends keyof typeof globalThis>(
    name: T,
    useNew = true,
    ...args: unknown[]
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never {
    if (useNew)
      return Kernel.__setPrototypeOf(
        new KernelStorage[name + '::constructor'](...args),
        KernelStorage[name + '::prototype'],
      );
    else
      return Kernel.__setPrototypeOf(
        KernelStorage[name + '::constructor'](...args),
        KernelStorage[name + '::prototype'],
      );
  }

  public static As<T extends keyof typeof globalThis>(
    object: unknown,
    name: T,
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never {
    return Kernel.__setPrototypeOf(object, KernelStorage[name + '::prototype']);
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
    Kernel.__defineProperty(func, 'name', {
      value: name,
      enumerable: false,
      configurable: true,
      writable: false,
    });
    return func;
  }

  public static SetLength<T extends CallableFunction>(func: T, length: number): T {
    Kernel.__defineProperty(func, 'length', {
      value: length,
      enumerable: false,
      configurable: true,
      writable: false,
    });
    return func;
  }

  public static SetClass<T extends CallableFunction>(func: T, name: string): T {
    Kernel.SetName(func, name);
    Kernel.SetFakeNative(func);
    return Kernel.LockPrototype(func);
  }

  public static LockPrototype<T extends CallableFunction>(func: T): T {
    Kernel.__defineProperty(func, 'prototype', {
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
  public static __globalThis = globalThis;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KernelStorage = Kernel as unknown as Record<string, any>;

const classes = Object.getOwnPropertyNames(globalThis)
  .map(k => (globalThis as typeof KernelStorage)[k])
  .filter(v => typeof v === 'function' && v.prototype);

for (const constructor of classes) {
  KernelStorage[constructor.name + '::constructor'] = constructor;
  KernelStorage[constructor.name + '::prototype'] = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(constructor.prototype),
  );
  KernelStorage[constructor.name + '::public static '] = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(constructor),
  );
}

const $native_functions = Kernel.Construct('WeakSet');
$native_functions.add(
  (Function.prototype.toString = function () {
    if ($native_functions.has(this) && typeof this === 'function')
      return `function ${this.name}() {\n    [native code]\n}`;
    const string = Kernel.As(Kernel.call(KernelStorage['Function::prototype'].toString, this), 'String');
    return string + '';
  }),
);
