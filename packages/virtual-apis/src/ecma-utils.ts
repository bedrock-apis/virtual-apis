/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

export function proxyifyFunction<T extends (...params: unknown[]) => unknown>(method: T): T {
   // Handle with proxy for support with "this" callback
   const final = new Proxy(method, {
      apply(t, that, params) {
         return t(that, params);
      },
   });

   // Return
   return final as T;
}
export function finalizeAsMethod<T extends (...params: unknown[]) => unknown>(method: T, length: number): T {
   // Mark function as native
   Kernel.SetFakeNative(method);

   // Set virtual number of params
   Kernel.SetLength(method, length);

   // All these names of methods are empty
   Kernel.SetName(method, '');

   return method;
}
export function finalizeAsConstructable<T extends new (...params: unknown[]) => unknown>(
   method: T,
   name: string,
   length: number,
   inheritance: (new (...params: unknown[]) => unknown) | null,
): T {
   if (inheritance) {
      Kernel.__setPrototypeOf(method, inheritance);
      Kernel.__setPrototypeOf(method.prototype, inheritance.prototype);
   }
   // Set virtual number of params
   Kernel.SetLength(method as unknown as () => unknown, length);
   // Mark function as native
   Kernel.SetClass(method, name);

   return method;
}

type Global = typeof globalThis;
type Keys = {
   [K in keyof Global]: Global[K] extends new (...args: any) => any ? K : never;
}[keyof Global];
type ConstructorLike = new (...params: unknown[]) => unknown;
type KernelType = {
   [K in Keys as `${K}::constructor`]: Global[K];
} & {
   [K in Keys as `${K}::prototype`]: Global[K]['prototype'];
} & {
   [K in Keys as `${K}::static`]: Omit<Global[K], keyof CallableFunction>;
} & {
   [K in keyof Global as `globalThis::${K}`]: Global[K];
};

class KernelClass {
   public static __call = Function.prototype.call; // Type to Type call method
   public static Call: <T extends (...params: P) => unknown, P extends unknown[]>(
      functionToCall: T,
      argumentAsThisValue: unknown,
      ...params: unknown[] | P
   ) => ReturnType<T> = Function.prototype.call.bind(Function.prototype.call);
   public static CallBindTo: <T extends (...params: P) => unknown, P extends any[]>(
      functionToBind: T,
   ) => (thisArgument: unknown, ...params: P) => ReturnType<T> = func =>
      Kernel.Call(Kernel['Function::prototype'].bind, Kernel.Call, null, func);
   public static __setPrototypeOf = Object.setPrototypeOf;
   public static __getPrototypeOf = Object.getPrototypeOf;
   public static __defineProperty = Object.defineProperty;
   public static __descriptors = Object.getOwnPropertyDescriptors;
   public static __getProperty = Object.getOwnPropertyDescriptor;
   public static __create = Object.create;

   public static Construct<T extends Keys, S extends Global[T]>(name: T): InstanceType<S>;
   public static Construct<T extends Keys, S extends Global[T]>(
      name: T,
      ...args: ConstructorParameters<S>
   ): InstanceType<S>;
   public static Construct<T extends Keys, S extends Global[T]>(name: T, ...args: unknown[]): InstanceType<S> {
      return KernelClass.__setPrototypeOf(
         new KernelStorage[name + '::constructor'](...args),
         KernelStorage[name + '::prototype'],
      );
   }

   public static As<T extends keyof typeof globalThis>(
      object: unknown,
      name: T,
   ): Global[T] extends { new (): infer I } | { (): infer I } ? I : never {
      return KernelClass.__setPrototypeOf(object, KernelStorage[name + '::prototype']);
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

   public static SetClass<T extends ConstructorLike | CallableFunction>(func: T, name: string): T {
      KernelClass.SetName(func as CallableFunction, name);
      KernelClass.SetFakeNative(func);
      return KernelClass.LockPrototype(func as CallableFunction) as T;
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

   public static SetFakeNative(func: CallableFunction | NewableFunction): void {
      if (typeof func === 'function') NATIVE_FUNCTIONS.add(func);
   }

   public static IsFakeNative(func: CallableFunction | NewableFunction): boolean {
      if (typeof func === 'function') return NATIVE_FUNCTIONS.has(func);
      else return false;
   }
   public static SetGlobalThis() {}
   public static log = globalThis.console.log;
   public static error = globalThis.console.error;
   public static warn = globalThis.console.warn;
   /*
   public static NewArray<T>(...params: T[]): Array<T> {
      return KernelClass.Construct('Array', ...params) as Array<T>;
   }
   public static ArrayIterator<T>(array: T[]): IterableIterator<T> {
      return KernelClass.__setPrototypeOf(
         KernelClass.Call(Kernel['Array::prototype'].values, array),
         ARRAY_ITERATOR_PROTOTYPE,
      );
   }
   public static MapValuesIterator<T>(map: Map<unknown, T>): IterableIterator<T> {
      return KernelClass.__setPrototypeOf(
         KernelClass.Call(Kernel['Map::prototype'].values, map),
         MAP_ITERATOR_PROTOTYPE,
      );
   }
   public static MapKeysIterator<T>(map: Map<T, unknown>): IterableIterator<T> {
      return KernelClass.__setPrototypeOf(KernelClass.Call(Kernel['Map::prototype'].keys, map), MAP_ITERATOR_PROTOTYPE);
   }
   public static SetIterator<T>(set: Set<T>): IterableIterator<T> {
      return KernelClass.__setPrototypeOf(
         KernelClass.Call(Kernel['Set::prototype'].values, set),
         SET_ITERATOR_PROTOTYPE,
      );
   }*/
   public static IsolatedCopy<T extends object>(obj: T) {
      let isolated = ISOLATED_COPIES.get(obj);
      if (!isolated) {
         const prototype = KernelClass.__getPrototypeOf(obj);
         ISOLATED_COPIES.set(
            obj,
            (isolated = KernelClass.__create(
               prototype ? this.IsolatedCopy(prototype) : prototype,
               KernelClass.__descriptors(obj),
            )),
         );
      }
      return isolated as T;
   }
   public static IsolatedConstructor<T extends Keys, S extends Global[T]>(name: T): S {
      const ctor = KernelStorage[name + '::constructor'];
      let isolated: new () => any = ISOLATED_CONSTRUCTORS.get(ctor) as any;
      if (isolated) return isolated as S;
      const prototype = KernelStorage[name + '::prototype'];
      isolated = class {
         public constructor(...params: any[]) {
            return new (ctor as any)(...params);
         }
      };
      Kernel.__setPrototypeOf(isolated, ctor);
      Kernel.__setPrototypeOf(isolated.prototype, prototype);
      ISOLATED_CONSTRUCTORS.set(ctor, isolated);
      return isolated as S;
   }
}
const ISOLATED_COPIES = new WeakMap<object, unknown>();
const ISOLATED_CONSTRUCTORS = new WeakMap<object, unknown>();
const KernelStorage = KernelClass as unknown as Record<string, any>;
KernelClass.__setPrototypeOf(KernelStorage, null);

const IGNORED_GLOBALS = ['sys', 'wasi', 'punycode'];
const GLOBAL_NAMES = Object.getOwnPropertyNames(globalThis).filter(k => !IGNORED_GLOBALS.includes(k));

for (const constructor of GLOBAL_NAMES.map(k => (globalThis as typeof KernelStorage)[k]).filter(
   v => typeof v === 'function' && v.prototype,
)) {
   KernelStorage[constructor.name + '::constructor'] = constructor;
   KernelStorage[constructor.name + '::prototype'] = KernelClass.IsolatedCopy(constructor.prototype);
   KernelStorage[constructor.name + '::static'] = KernelClass.IsolatedCopy(constructor);
}

for (const globalName of GLOBAL_NAMES) {
   KernelStorage[`globalThis::${globalName}`] = globalThis[globalName as keyof typeof globalThis];
}

const NATIVE_FUNCTIONS = KernelClass.Construct('WeakSet');
NATIVE_FUNCTIONS.add(
   (Function.prototype.toString = function () {
      if (NATIVE_FUNCTIONS.has(this)) return `function ${this.name}() {\n    [native code]\n}`;
      const string = KernelClass.As(KernelClass.Call(KernelStorage['Function::prototype'].toString, this), 'String');
      return string + '';
   }),
);

export const Kernel = KernelClass as typeof KernelClass & KernelType;
Kernel.__setPrototypeOf(ISOLATED_COPIES, Kernel['WeakMap::prototype']);
Kernel.__setPrototypeOf(ISOLATED_CONSTRUCTORS, Kernel['WeakMap::prototype']);

// Symbol is not constructor so there is no default copy created
// Also we can't use Kernel.SymbolCopy because vitest parser crashes for some reason
// seems like coverage doesn't supports it
export const KernelSymbolCopy = KernelClass.IsolatedCopy(Symbol);
