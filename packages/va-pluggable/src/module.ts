import { compareVersions, d, VaEventLoader } from '@bedrock-apis/va-common';
import { ConstructableSymbol, ModuleSymbol } from '@bedrock-apis/virtual-apis';
import chalk from 'chalk';
import { Plugin } from './api';
import { Impl, ImplStatic, ImplStoraged } from './implementation';
import { ModuleTypeMap, PartialParts, StorageThis, ThisContext } from './types';

type Version = `${number}.${number}.${number}`;

export type ConstructorImpl<This, Mod extends ModuleTypeMap, T extends keyof Mod> = Mod[T] extends new (
   ...args: infer T
) => unknown
   ? {
        // eslint-disable-next-line @typescript-eslint/no-misused-new
        constructor(this: This, ...args: T): void;
     }
   : object;

type Constructable = { prototype: object };

export type Constructables<T extends ModuleTypeMap> = {
   [K in keyof T as T[K] extends Constructable ? K : never]: T[K] extends Constructable ? object : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PluginModule<Mod extends ModuleTypeMap = any, P extends Plugin = Plugin> {
   private static debugMessagesRemoveLater = new Set();

   public constructor(
      public readonly plugin: P,
      public readonly name: string,
      public readonly versionFrom?: Version,
      public readonly versionTo?: Version,
   ) {
      this.plugin.modules.add(this);
   }

   protected moduleSymbols: ModuleSymbol[] = [];

   public implement<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T]['prototype'], ThisContext<Mod[T]['prototype'], P, Mod>>,
   ) {
      new Impl(this, className as string, implementation);
   }

   public implementStatic<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T], ThisContext<Mod[T], P, Mod>>,
   ) {
      new ImplStatic(this, className as string, implementation);
   }

   public implementWithStorage<T extends keyof Mod, Storage extends object>(
      className: T,
      createStorage: (implementation: Mod[T]['prototype'], mod: PluginModuleLoaded<Mod>, plugin: P) => Storage,
      implementation: { storage?: Storage } & PartialParts<
         Mod[T]['prototype'],
         StorageThis<Mod[T]['prototype'], P, Mod, Storage>
      > &
         ConstructorImpl<StorageThis<Mod[T]['prototype'], P, Mod, Storage>, Mod, T>,
   ) {
      type Native = Mod[T]['prototype'];

      return new ImplStoraged<Storage, Native extends object ? Native : object>(
         this,
         className as string,
         implementation,
         createStorage as unknown as (n: object, m: PluginModuleLoaded, plugin: Plugin) => Storage,
      );
   }

   public onModulesLoaded(): void {
      for (const symbol of this.plugin.context.getModuleSymbols(this.name)) {
         const version = symbol.version;

         if (this.versionFrom && compareVersions(this.versionFrom, version) === 1) continue;
         if (this.versionTo && compareVersions(this.versionTo, version) === -1) continue;

         this.moduleSymbols.push(symbol);
      }

      const mod = this.moduleSymbols[0];
      if (!mod) {
         const m = `Not implementing ${this.name} for ${this.versionFrom}...${this.versionTo}`;
         if (!PluginModule.debugMessagesRemoveLater.has(m)) {
            d(chalk.yellow(m));
            PluginModule.debugMessagesRemoveLater.add(m);
         }
      } else {
         this.onLoad.invoke(new PluginModuleLoaded(mod, this.plugin), this.moduleSymbols);
      }
   }

   public onLoad = new VaEventLoader<[PluginModuleLoaded<Mod>, ModuleSymbol[]]>();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PluginModuleLoaded<Mod extends ModuleTypeMap = any> {
   public constructor(
      protected readonly moduleSymbol: ModuleSymbol,
      protected readonly plugin: Plugin,
   ) {}

   public resolve<T extends keyof Mod>(className: T) {
      const symbol = this.tryResolve(className);
      if (!symbol) throw new Error(`Unable to resolve ${String(className)}: symbol not found`);

      return symbol.getRuntimeValue(this.plugin.context) as Mod[T];
   }

   public tryResolve(className: keyof Mod) {
      return this.moduleSymbol.symbols.get(String(className));
   }

   public construct<T extends keyof Constructables<Mod>>(className: T) {
      const symbol = this.moduleSymbol.symbols.get(String(className));
      if (!symbol)
         throw new Error(
            `Unable to construct ${String(className)}: symbol not found in ${this.moduleSymbol.nameVersion}`,
         );

      if (!(symbol instanceof ConstructableSymbol))
         throw new Error(
            `Unable to construct ${String(className)} from ${this.moduleSymbol.nameVersion}: non constructable`,
         );

      return symbol?.createRuntimeInstanceInternal(this.plugin.context) as Mod[T]['prototype'];
   }
}
