import { Kernel } from '@bedrock-apis/kernel-isolation';
import { getParsedImage } from '@bedrock-apis/binary/src/get-image';
import { ImageModulePrepared } from '@bedrock-apis/binary/src/structs';
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

   public static GetModule(uuid: string) {
      return this.MODULES.get(uuid);
   }

   public static SetModule(module: ModuleContext) {
      this.MODULES.set(module.uuid, module);
   }

   public static GetMCVersion(moduleVersion: string) {
      // TODO Resolve version from 2.1.0-beta.1.21.80 for example
      return 'latest';
   }

   public static async GetOrCompileModule(specifier: string, version: string) {
      const mcVersion = this.GetMCVersion(version);
      const modules = await getParsedImage(mcVersion);
      const moduleDefinition = modules.find(e => e.name === specifier && e.version === version);
      if (!moduleDefinition) throw new Kernel['globalThis::Error'](`Unknown module: ${specifier} ${version}`);

      return this.MODULES.get(moduleDefinition.uuid) ?? this.CompileModule(moduleDefinition);
   }

   public static CompileModule(module: ImageModulePrepared) {
      const ctx = new ModuleContext(module.uuid, module.version);
      this.MODULES.set(ctx.id, ctx);
      // todo resolve all deps
      // todo add all types defintions etc

      ctx.resolveAllDynamicTypes();

      return ctx;
   }
}
