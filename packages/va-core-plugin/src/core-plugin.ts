import { Pluggable, PluginFeature } from '@bedrock-apis/va-pluggable';
import {
   ErrorFactory,
   InvocableSymbol,
   InvocationInfo,
   MapWithDefaults,
   ObjectValueSymbol,
   PANIC_ERROR_MESSAGES,
   ReportAsIs,
   SymbolCallback,
} from '@bedrock-apis/virtual-apis';
import { DecoratorsFeature } from './decorators';

export const typeToSymbolMapSymbol: unique symbol = Symbol('TypeToSymbolMap');
export enum FieldType {
   Get,
   GetSet,
   Method,
   Constructor,
}
export class CorePlugin extends Pluggable {
   public static registerDefaultFeature(feature: typeof PluginFeature) {}

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
         const symbol = this.getInvocableSymbolFor(key);
         if (!symbol) {
            console.warn('unknown symbol: ' + key);
            continue;
         }
         switch (meta.kind) {
            case FieldType.Get:
               this.registerCallback(symbol, ctx => {
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

   public readonly coreCallbacks = new MapWithDefaults<
      InvocableSymbol<unknown>,
      { impl: SymbolCallback; priority: number }[]
   >();

   public override registerCallback(symbol: InvocableSymbol<unknown>, impl: SymbolCallback): void {
      this.implement(symbol, impl);
   }

   public implement(symbol: InvocableSymbol<unknown>, impl: SymbolCallback, priority = 0) {
      const is = this.coreCallbacks.getOrCreate(symbol, () => []);

      is.push({ impl, priority });
      is.sort((a, b) => b.priority - a.priority);
   }

   // Anyone can invoke the callbacks but in most cases its from user addon context
   public override invoke(invocation: InvocationInfo) {
      const callbacks = this.coreCallbacks.get(invocation.symbol);

      if (!callbacks?.length) {
         invocation.diagnostics.errors.report(
            new ErrorFactory(PANIC_ERROR_MESSAGES.NoImplementation(invocation.symbol.identifier)),
         );
         return;
      }

      for (let i = 0; i < callbacks.length; i++) {
         const callback = callbacks[i];
         try {
            callback?.impl(invocation);
         } catch (error) {
            invocation.diagnostics.errors.report(new ReportAsIs(error as Error));
         }
      }
   }
}

export const coreDecoratorsFeature = new DecoratorsFeature();
export const va = coreDecoratorsFeature.decorators;
