import { ContextPlugin, InvocationInfo } from '@bedrock-apis/virtual-apis';
import type * as mc from '@minecraft/server';
import { Plugin } from './api';
import { PluginModuleLoaded } from './module';

type ModuleTypeValue =
   | {
        new (...args: unknown[]): void;
        prototype: object;
     }
   | {
        prototype: object;
     }
   | Record<string, unknown>;

export type ServerModuleTypeMap = {
   [K in keyof typeof mc as (typeof mc)[K] extends ModuleTypeValue ? K : never]: (typeof mc)[K];
};

export type ModuleTypeMap = Record<string, ModuleTypeValue>;

export type PartialParts<B, ThisArg = B> = {
   [P in keyof B]?: B[P] extends (...param: infer param) => infer ret ? (this: ThisArg, ...param: param) => ret : B[P];
};

export class ThisContext<T, P extends Plugin, Mod extends ModuleTypeMap> {
   public constructor(
      public readonly invocation: InvocationInfo,
      public readonly instance: T,
      public readonly implementation: T,
      public readonly module: PluginModuleLoaded<Mod>,
      public readonly plugin: P,
   ) {}

   public getPlugin<T extends typeof ContextPlugin>(plugin: T): InstanceType<T> {
      return this.plugin.context.getPluginForce(plugin, this.invocation);
   }
}

export class StorageThis<T, P extends Plugin, Mod extends ModuleTypeMap, Storage> extends ThisContext<T, P, Mod> {
   public static create(storage: object, ...args: ConstructorParameters<typeof ThisContext>) {
      const storaged = new this(...args);
      (storaged as Mutable<typeof storaged>).storage = storage;
      return storaged;
   }
   public readonly storage!: Storage;
}
