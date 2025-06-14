import { getParsedImage } from '@bedrock-apis/binary';
import { Kernel } from '@bedrock-apis/kernel-isolation';
import { ModuleContext } from './module-context';

export interface ContextConfig {
   StrictReturnTypes: boolean;
   GetterRequireValidBound: boolean;
}

export const ContextOptions: { readonly [K in ContextConfigKeys]: K } = {
   StrictReturnTypes: 'StrictReturnTypes',
   GetterRequireValidBound: 'GetterRequireValidBound',
} as const;

export type ContextConfigKeys = keyof ContextConfig;

export class Context extends Kernel.Empty {
   private static readonly CONFIG: ContextConfig = {
      StrictReturnTypes: true,
      GetterRequireValidBound: false,
   };
   public static SetConfigProperty<T extends ContextConfigKeys>(key: T, value: ContextConfig[T]) {
      this.CONFIG[key] = value;
   }
   public static GetConfigProperty<T extends ContextConfigKeys>(key: T): ContextConfig[T] {
      return this.CONFIG[key];
   }
   public static Configure(config: Partial<ContextConfig>) {
      Kernel['Object::static'].assign(this.CONFIG, config);
   }

   private static readonly MODULES = Kernel.Construct('Map') as Map<string, ModuleContext>;

   protected static GetModuleId(specifier: string, version: string) {
      return `${specifier} ${version}`;
   }

   public static GetModule(specifier: string, version: string) {
      return this.MODULES.get(this.GetModuleId(specifier, version));
   }

   protected static GetMinecraftVersionFromModuleVersion(moduleVersion: string) {
      // TODO Resolve version from 2.1.0-beta.1.21.80 for example
      return 'latest';
   }

   public static async LoadModule(specifier: string, version: string) {
      const cached = this.MODULES.get(this.GetModuleId(specifier, version));
      if (cached) return cached;

      const image = await getParsedImage(this.GetMinecraftVersionFromModuleVersion(version));
      const { stringCollector, modules } = image;
      const fromIndex = stringCollector.fromIndex.bind(stringCollector);

      // todo maybe use specifier index and version index idk
      const imageModule = modules.find(
         e => fromIndex(e.metadata.name) === specifier && fromIndex(e.metadata.version) === version,
      );

      if (!imageModule) throw new Kernel['globalThis::Error'](`Unknown module: ${specifier} ${version}`);
      const { metadata } = imageModule;

      const moduleContext = new ModuleContext(
         fromIndex(metadata.uuid),
         fromIndex(metadata.version),
         fromIndex(metadata.name),
      );
      this.MODULES.set(this.GetModuleId(moduleContext.specifier, moduleContext.version), moduleContext);
      const { symbols, exports } = await imageModule.read();
      moduleContext.loadSymbols(stringCollector, image.typesCollector, metadata.dependencies, symbols, exports);
   }
}
