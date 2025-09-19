import { Pluggable } from '@bedrock-apis/va-pluggable';
import { ObjectValueSymbol } from '@bedrock-apis/virtual-apis';

export const typeToSymbolMapSymbol: unique symbol = Symbol('TypeToSymbolMap');
export enum FieldType {
   Get,
   GetSet,
   Method,
   Constructor,
}
export class CorePlugin extends Pluggable {
   public override readonly identifier = 'virtual_apis:core_plugin';
   private static readonly objectsMap = new Map<string, object>();
   private static readonly implementations = new Map<
      string,
      { prototype: object; property: string; kind: FieldType; nativeResult: boolean }
   >();
   public static registryModuleObjectVariable(symbol: string, storage: object) {
      this.objectsMap.set(symbol, storage);
   }
   // This is decorator so i prefer the naming convention with CamelCase
   public static Class(id: string) {
      return (target: { new (...params: unknown[]): unknown }) => {
         target.prototype[typeToSymbolMapSymbol] = id;
      };
   }
   // This is decorator so i prefer the naming convention with CamelCase
   public static Get(id: string, nativeResult = true) {
      return (prototype: object, property: string) => {
         this.implementations.set(id, { prototype, property, kind: FieldType.Get, nativeResult });
      };
   }
   public override onAfterReady(): void {
      // Registry Objects
      for (const [key, meta] of CorePlugin.implementations.entries()) {
         const symbol = this.manager.getInvocableSymbolFor(key);
         if (!symbol) {
            console.warn('unknown symbol: ' + key);
            continue;
         }
         switch (meta.kind) {
            case FieldType.Get:
               this.manager.registerCallback(symbol, ctx => {
                  ctx.result = Reflect.get(meta.prototype, meta.property, this.getStorage(ctx.thisObject as object));

                  // This should resolve the class symbol it self but its not that simple i know
                  if (meta.nativeResult)
                     ctx.result = this.getCreateHandleFor(ctx.result!, /*FIXME - Important asf*/ null!);
               });
         }
      }
      for (const key of CorePlugin.objectsMap.keys()) {
         const symbol = this.context.symbols.get(key);
         if (!symbol) {
            console.warn('Object not found: ' + key);
            continue;
         }

         if (!(symbol instanceof ObjectValueSymbol)) {
            console.warn('Specified symbol is not object symbol: ' + key);
            continue;
         }

         this.bindStorageWithObject(symbol, CorePlugin.objectsMap.get(key)!);
      }
   }
}
