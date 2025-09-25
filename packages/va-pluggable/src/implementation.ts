// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck not really used now anymore

import { identifiers } from '@bedrock-apis/va-common';
import { InvocationInfo } from '@bedrock-apis/virtual-apis';
import { PluginModule, PluginModuleLoaded } from './module';
import { ModuleTypeMap, ThisContext } from './types';

export class Impl {
   public constructor(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      public readonly module: PluginModule<any>,
      public readonly className: string,
      public readonly implementation: object,
   ) {
      this.module.onLoad.subscribe((loaded, symbol) => {
         for (const [key, prop] of Object.entries(Object.getOwnPropertyDescriptors(implementation))) {
            if (prop.get) {
               this.implGetSet(loaded, symbol, key, prop);
            } else {
               this.implMethod(key, symbol, prop, loaded);
            }
         }
      });
   }

   private implMethod(key: string, version: string, prop: PropertyDescriptor, loaded: PluginModuleLoaded) {
      if (key === 'constructor') {
         this.module.plugin.context.implement(version, this.ctorKey(this.className), ctx => {
            // We use ctx.result here because ctx.thisObject is not a native handle
            // which results in different storages between constructor and methods
            prop.value.call(this.getThisValue(ctx.result!, ctx, loaded), ...ctx.params);
         });
      } else {
         this.module.plugin.context.implement(version, this.methodKey(this.className, key), ctx => {
            ctx.result = prop.value.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ...ctx.params);
         });
      }
   }

   private implGetSet(loaded: PluginModuleLoaded, version: string, key: string, { get, set }: PropertyDescriptor) {
      if (get) {
         this.module.plugin.context.implement(version, this.getterKey(this.className, key), ctx => {
            ctx.result = get.call(this.getThisValue(ctx.thisObject!, ctx, loaded));
         });
      }
      if (set) {
         this.module.plugin.context.implement(version, this.setterKey(this.className, key), ctx => {
            ctx.result = set.call(this.getThisValue(ctx.thisObject!, ctx, loaded), ctx.params[0]);
         });
      }
   }

   protected methodKey = identifiers.method;
   protected getterKey = identifiers.getter;
   protected setterKey = identifiers.setter;
   protected ctorKey = identifiers.constructor;

   protected getThisValue(
      native: unknown,
      invocation: InvocationInfo,
      loaded: PluginModuleLoaded<ModuleTypeMap>,
   ): ThisContext<object, ModuleTypeMap> {
      return new ThisContext(invocation, native as object, this.implementation, loaded, this.module.plugin);
   }
}

export class ImplStatic extends Impl {
   protected override methodKey = identifiers.static.method;
   protected override getterKey = identifiers.static.getter;
   protected override setterKey = identifiers.static.setter;
}
