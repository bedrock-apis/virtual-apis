import type * as mc from '@minecraft/server';

// TODO Figure out how to properly map types?
export type ModuleTypeMap = { [K in keyof typeof mc]: (typeof mc)[K] extends NewableFunction ? (typeof mc)[K] : never };

type PartialParts<B, ThisArg = B> = {
   [P in keyof B]?: B[P] extends (...param: infer param) => infer ret ? (this: ThisArg, ...param: param) => ret : B[P];
};

export const STORAGE = Symbol('STORAGE');

export abstract class Plugin {
   protected abstract readonly id: string;

   protected onWarning(warning: unknown) {}
   protected onError(error: unknown) {}
   protected onPanic(panic: unknown) {}
   protected implement<T extends keyof ModuleTypeMap>(
      className: T,
      implementation: PartialParts<ModuleTypeMap[T]['prototype']>,
   ) {}
   protected implementWithStorage<T extends keyof ModuleTypeMap, Storage>(
      className: T,
      id: string,
      storage: (implementation: ModuleTypeMap[T]) => Storage,
      implementation: PartialParts<ModuleTypeMap[T]['prototype'], ModuleTypeMap[T]['prototype'] & { STORAGE: Storage }>,
   ) {
      return undefined as unknown as PluginImplementation<Storage, ModuleTypeMap[T]>; // TODO Implement
   }
}

export abstract class PluginWithConfig<Config extends object> extends Plugin {
   protected abstract config: Config;
   public configure(config: Config) {
      Object.assign(this.config ?? {}, config);
   }
}

export class PluginImplementation<T, Native> {
   public getStorage(nativeObject: Native): T {
      return undefined as T; // TODO Implement
   }
}

/**
 * Adds properties to the provided object prototype
 *
 * Can override and modify properties
 */
/*
function overTakes<B>(prototype: B, object: PartialParts<B>): B {
   const prototypeOrigin = Kernel['globalThis::Object'].setPrototypeOf(
      Kernel['globalThis::Object'].defineProperties(
         {},
         Kernel['globalThis::Object'].getOwnPropertyDescriptors(prototype),
      ),
      Kernel['globalThis::Object'].getPrototypeOf(prototype),
   );
   Kernel['globalThis::Object'].setPrototypeOf(object, prototypeOrigin);
   Kernel['globalThis::Object'].defineProperties(
      prototype,
      Kernel['globalThis::Object'].getOwnPropertyDescriptors(object),
   );
   return prototypeOrigin;
}*/
