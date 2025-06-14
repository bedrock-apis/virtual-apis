import { BinaryImageLoader } from '@bedrock-apis/binary';
import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
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

   /** @internal */
   public static ResolveMinecraftVersionFromModuleVersion(moduleVersion: string) {
      const match = /-\w+\.(\d+\.\d+\.\d+)/gm.exec(moduleVersion);
      return match?.[1] ?? 'latest';
   }

   public static async LoadModule(specifier: string, version: string) {
      const cached = this.MODULES.get(this.GetModuleId(specifier, version));
      if (cached) return cached;

      const image = await BinaryImageLoader.GetParsedImage(this.ResolveMinecraftVersionFromModuleVersion(version));
      const { stringSlice, modules } = image;
      const { fromIndex: str } = stringSlice;
      const imageModule = modules.find(e => str(e.metadata.name) === specifier && str(e.metadata.version) === version);

      if (!imageModule) throw new Kernel['globalThis::Error'](`Unknown module: ${specifier} ${version}`);

      const { metadata } = imageModule;
      for (const dep of KernelArray.From(metadata.dependencies).getIterator()) {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         Context.LoadModule(str(dep.uuid!), str(dep.versions![dep.versions!.length - 1]!));
      }

      const moduleContext = new ModuleContext(str(metadata.uuid), str(metadata.version), str(metadata.name));
      this.MODULES.set(this.GetModuleId(moduleContext.specifier, moduleContext.version), moduleContext);

      moduleContext.loadSymbols(stringSlice, image.typeSlice, await imageModule.read());
   }
}
