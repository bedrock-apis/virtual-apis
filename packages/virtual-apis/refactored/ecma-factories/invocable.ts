import { KernelArray } from '@bedrock-apis/kernel-isolation';

type ConstructableFunctionCallback = (thisObject: unknown, newTarget: unknown, params: KernelArray<unknown>) => unknown;
export function createConstructableFunction<T extends new (...params: unknown[]) => unknown>(
   callback: ConstructableFunctionCallback,
): T {
   return function (this: unknown, ...params: unknown[]) {
      return callback(this, new.target, KernelArray.From(params));
   } as unknown as T;
}

type FunctionGeneralCallback = (thisObject: unknown, params: KernelArray<unknown>) => unknown;
export function createFunction<T extends new (...params: unknown[]) => unknown>(callback: FunctionGeneralCallback): T {
   return function (this: unknown, ...params: unknown[]) {
      return callback(this, KernelArray.From(params));
   } as unknown as T;
}
