import { ModuleSymbol } from '../symbols/module';
import { PluginContext } from './plugin';

const { create } = Object;

export class Context {
   private static runtimeIdIncrementalVariable = 0;
   public readonly runtimeId = Context.runtimeIdIncrementalVariable++;
   private static contexts = new Map<number, Context>();
   public constructor() {
      Context.contexts.set(this.runtimeId, this);
   }

   public static getRuntimeModule(id: number, name: string) {
      const context = this.contexts.get(id)!;
      return context.moduleSymbols.get(name)?.getRuntimeValue(context);
   }
   public readonly plugins: Set<PluginContext> = new Set();
   public readonly moduleSymbols: Map<string, ModuleSymbol> = new Map();
   // Compiled modules
   public readonly moduleRuntimes: Map<string, object> = new Map();

   //#region NativeHandles
   public readonly nativeHandles: WeakSet<object> = new WeakSet();
   public isNativeHandle(value: unknown): boolean {
      //Returns if the value is native handle to the native class or not
      return this.nativeHandles.has(value as object);
   }
   public createNativeHandle(): object {
      const handle = create(null);
      this.nativeHandles.add(handle);
      return handle;
   }

   //#endregion
}
