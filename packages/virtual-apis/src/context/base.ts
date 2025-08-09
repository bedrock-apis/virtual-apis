import { ModuleSymbol } from '../symbols/module';
import { PluginContext } from './plugin';

const { create } = Object;

export class Context {
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
