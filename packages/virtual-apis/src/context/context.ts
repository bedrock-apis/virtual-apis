import { getParsedImage, ImageModulePrepared } from '@bedrock-apis/binary';
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

   protected static GetMinecraftVersionFromModuleVersion(moduleVersion: string) {
      // TODO Resolve version from 2.1.0-beta.1.21.80 for example
      return 'latest';
   }

   protected static GetModuleId(specifier: string, version: string) {
      return `${specifier} ${version}`;
   }

   public static GetModule(specifier: string, version: string) {
      return this.MODULES.get(this.GetModuleId(specifier, version));
   }

   public static async GetOrCompileModule(specifier: string, version: string) {
      const cached = this.MODULES.get(this.GetModuleId(specifier, version));
      if (cached) return cached;

      const modules = await getParsedImage(this.GetMinecraftVersionFromModuleVersion(version));
      const module = modules.find(e => e.name === specifier && e.version === version);
      if (!module) throw new Kernel['globalThis::Error'](`Unknown module: ${specifier} ${version}`);

      return this.CompileModule(module);
   }

   protected static CompileModule(module: ImageModulePrepared) {
      const ctx = new ModuleContext(module.uuid, module.version, module.name);
      this.MODULES.set(this.GetModuleId(ctx.specifier, ctx.version), ctx);
      // todo resolve all deps
      // todo add all types defintions etc

      // for (const dep of module.deps) await this.GetOrCompileModule(dep.specifier, dep.version)

      // for (const clsD of module.classes) {
      //    const cls = new ClassAPISymbol();
      //    cls.methods.push()
      //    cls.properties.push()
      //    cls.staticMethods.push()
      //    cls.staticProperties.push()
      //    ctx.exports[clsD.name] = cls.api
      // }

      ctx.resolveAllDynamicTypes();

      return ctx;
   }
}
