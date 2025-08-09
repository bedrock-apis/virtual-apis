import { Kernel } from '@bedrock-apis/kernel-isolation';

export function proxyifyFunction<T extends (...params: unknown[]) => unknown>(method: T): T {
   // Handle with proxy for support with "this" callback
   const final = new Kernel['globalThis::Proxy'](method, {
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
   Kernel.SetLength(method as Function, length);
   // Mark function as native
   Kernel.SetClass(method, name);

   return method;
}
