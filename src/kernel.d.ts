export class Kernel {
    private constructor();
    static __call: Function["call"];
    static __setPrototypeOf: ObjectConstructor["setPrototypeOf"];
    static __defineProperty: ObjectConstructor["defineProperty"];
    static __create: ObjectConstructor["create"];
    static Construct<T extends keyof typeof globalThis>(name: T, useNew?: boolean,...args: any[]): (typeof globalThis)[T] extends ({new (): infer I} | {(): infer I})?I:never
    static Constructor<T extends keyof typeof globalThis>(name: T): (typeof globalThis)[T] extends ({new (): infer I} | {(): infer I})?(typeof globalThis)[T]:never
    static As<T extends keyof typeof globalThis>(object: any, name: T): (typeof globalThis)[T] extends ({new (): infer I} | {(): infer I})?I:never
    static Prototype<T extends keyof typeof globalThis>(name: T): (typeof globalThis)[T] extends ({new (): infer I} | {(): infer I})?I:never
    static Static<T extends keyof typeof globalThis>(name: T): (typeof globalThis)[T] extends ({new (): infer I} | {(): infer I})?{[key in  keyof (typeof globalThis)[T]]:(typeof globalThis)[T][key]}:never
    static SetName<T extends ()=>void>(func: T,name: string): T
    static SetLength<T extends ()=>void>(func: T,length: number): T
    static SetClass<T extends ()=>any>(func: T,name: string): T 
    static LockPrototype<T extends ()=>any>(func: T): T
    static SetFakeNative<T extends ()=>any>(func: T): void
    static IsFakeNative<T extends ()=>any>(func: T): boolean
    static SetGlobalThis(): void
    static __globalThis: typeof globalThis;
}
export type Kernel = {[k in keyof typeof globalThis]: globalThis[k] extends new (...params: any)=>any?globalThis[k]:never};