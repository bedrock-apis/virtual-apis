export class Kernel {
  private constructor();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  static __call: Function['call'];
  static __setPrototypeOf: ObjectConstructor['setPrototypeOf'];
  static __defineProperty: ObjectConstructor['defineProperty'];
  static __create: ObjectConstructor['create'];

  static Construct<T extends keyof typeof globalThis>(
    name: T,
    useNew?: boolean,
    ...args: unknown[]
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never;

  static Constructor<T extends keyof typeof globalThis>(
    name: T,
  ): (typeof globalThis)[T] extends { new (): void } | { (): void } ? (typeof globalThis)[T] : never;

  static As<T extends keyof typeof globalThis>(
    object: unknown,
    name: T,
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never;

  static Prototype<T extends keyof typeof globalThis>(
    name: T,
  ): (typeof globalThis)[T] extends { new (): infer I } | { (): infer I } ? I : never;

  static Static<T extends keyof typeof globalThis>(
    name: T,
  ): (typeof globalThis)[T] extends { new (): void } | { (): void }
    ? { [key in keyof (typeof globalThis)[T]]: (typeof globalThis)[T][key] }
    : never;

  static SetName<T extends (...params: any[]) => void>(func: T, name: string): T;
  static SetLength<T extends (...params: any[]) => void>(func: T, length: number): T;
  static SetClass<T extends (...params: any[]) => unknown>(func: T, name: string): T;
  static LockPrototype<T extends (...params: any[]) => unknown>(func: T): T;
  static SetFakeNative<T extends (...params: any[]) => unknown>(func: T): void;
  static IsFakeNative<T extends (...params: any[]) => unknown>(func: T): boolean;
  static SetGlobalThis(): void;
  static __globalThis: typeof globalThis;
}

export type Kernel = {
  [k in keyof typeof globalThis]: globalThis[k] extends new (...params: unknown) => unknown ? globalThis[k] : never;
};
