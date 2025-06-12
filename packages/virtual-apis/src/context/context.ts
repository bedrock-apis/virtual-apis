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

   public static GetModule(uuid: string) {
      return this.MODULES.get(uuid);
   }

   public static SetModule(module: ModuleContext) {
      this.MODULES.set(module.uuid, module);
   }

   public static GetOrCompileModule(specifier: string, version: string) {}
}
