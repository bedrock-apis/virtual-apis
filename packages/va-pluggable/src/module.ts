import { compareVersions, dwarn, VaEventLoader } from '@bedrock-apis/va-common';
import { ConstructableSymbol, ModuleSymbol } from '@bedrock-apis/virtual-apis';
import { Impl, ImplStatic, ImplStorage } from './implementation';
import { Pluggable } from './main';
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

type Prototyped = { prototype: object };

export type Constructable<T extends ModuleTypeMap> = {
   [K in keyof T as T[K] extends Prototyped ? K : never]: T[K] extends Prototyped ? object : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PluginModule<Mod extends ModuleTypeMap = any> {
   private static debugMessagesRemoveLater = new Set();

   public constructor(
      public readonly plugin: Pluggable,
      public readonly name: string,
      public readonly versionFrom?: Version,
      public readonly versionTo?: Version,
   ) {
      this.plugin.onAfterReadyEvent.subscribe(() => {
         this.onModulesLoaded();
      });
   }

   public implement<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T]['prototype'], ThisContext<Mod[T]['prototype'], Mod>>,
   ) {
      new Impl(this, className as string, implementation);
   }

   public implementStatic<T extends keyof Mod>(
      className: T,
      implementation: PartialParts<Mod[T], ThisContext<Mod[T], Mod>>,
   ) {
      new ImplStatic(this, className as string, implementation);
   }

   public implementWithStorage<T extends keyof Mod, Storage extends object>(
      className: T,
      createStorage: (implementation: Mod[T]['prototype'], mod: PluginModuleLoaded<Mod>) => Storage,
      implementation: { storage?: Storage } & PartialParts<
         Mod[T]['prototype'],
         StorageThis<Mod[T]['prototype'], Mod, Storage>
      > &
         ConstructorImpl<StorageThis<Mod[T]['prototype'], Mod, Storage>, Mod, T>,
   ) {
      type Native = Mod[T]['prototype'];

      return new ImplStorage<Storage, Native extends object ? Native : object>(
         this,
         className as string,
         implementation,
         createStorage as unknown as (n: object, m: PluginModuleLoaded) => Storage,
      );
   }

   protected onModulesLoaded(): void {
      // Prefer bindings modules over normal modules for simplicity
      const symbol =
         this.plugin.context.getModuleSymbol(this.name + '-bindings') ?? this.plugin.context.getModuleSymbol(this.name);
      let matches = true;

      if (symbol) {
         const version = symbol.version;
         if (this.versionFrom && compareVersions(this.versionFrom, version) === 1) matches = false;
         if (this.versionTo && compareVersions(this.versionTo, version) === -1) matches = false;
      }

      if (!symbol || !matches) {
         const m = `Not implementing ${this.name} for ${this.versionFrom}...${this.versionTo}`;
         if (!PluginModule.debugMessagesRemoveLater.has(m)) {
            dwarn(m);
            PluginModule.debugMessagesRemoveLater.add(m);
         }
      } else {
         this.onLoad.invoke(new PluginModuleLoaded(symbol, this.plugin), symbol);
      }
   }

   public onLoad = new VaEventLoader<[PluginModuleLoaded<Mod>, ModuleSymbol]>();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PluginModuleLoaded<Mod extends ModuleTypeMap = any> {
   public constructor(
      protected readonly moduleSymbol: ModuleSymbol,
      protected readonly plugin: Pluggable,
   ) {}

   public resolve<T extends keyof Mod>(className: T) {
      const symbol = this.tryResolve(className);
      if (!symbol) throw new Error(`Unable to resolve ${String(className)}: symbol not found`);

      return symbol.getRuntimeValue(this.plugin.context) as Mod[T];
   }

   public tryResolve(className: keyof Mod) {
      return this.moduleSymbol.symbols.get(String(className));
   }

   public construct<T extends keyof Constructable<Mod>>(className: T) {
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
