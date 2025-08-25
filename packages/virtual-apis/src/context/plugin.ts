import type { ModuleSymbol, ObjectValueSymbol } from '../symbols';
import type { Context } from './base';

// Low level plugin system
export abstract class PluginContext {
   public abstract readonly identifier: string;
   protected constructor() {}
   public static instantiate<T extends new () => S, S extends PluginContext>(this: T): S {
      return new this();
   }
   //
   public onBeforeModuleCompilation(context: Context, module: ModuleSymbol): void {}
   public onAfterModuleCompilation(context: Context, module: ModuleSymbol): void {}
   public getStaticInstanceBinding(context: Context, symbol: ObjectValueSymbol): object | null {
      return null;
   }
   public onContextInitialization(context: Context): void {}
   public onContextDispose(context: Context): void {}
}
