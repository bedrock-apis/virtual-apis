import type { Context } from './base';

// Low level plugin system
export abstract class PluginContext {
   public constructor(public readonly context: Context) {}
   public static instantiate<T extends new () => S, S extends PluginContext>(this: T): S {
      return new this();
   }
   //
   public onBeforeCompilation(context: Context) {}
   public onAfterCompilation(context: Context) {}
}
