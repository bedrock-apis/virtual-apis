import { Kernel } from '../api-builder';
import { KernelArray } from '../api-builder/isolation';
import { PluginWithConfig } from '../plugin-api/api';

const TARGETS = ['Entity', 'Block', 'ItemStack'] as const;
type Targets = (typeof TARGETS)[number];

type ComponentsMetadata = Record<string, unknown>;

interface Config {
   componentsMetadata: Record<Targets, ComponentsMetadata>;
}

class ComponentsPlugin extends PluginWithConfig<Config> {
   protected id = 'components';

   // TODO Pull data from bds-docs
   protected config: Config = {
      componentsMetadata: {
         Entity: {},
         Block: {},
         ItemStack: {},
      },
   };

   protected addComponents(target: 'Entity' | 'ItemStack' | 'Block') {
      return this.implementWithStorage(
         target,
         'components',
         () => {
            const storage = new Kernel['globalThis::Map']<string, unknown>();
            const metadata = this.config.componentsMetadata[target];
            // eslint-disable-next-line custom/no-iterators
            for (const component of Kernel['globalThis::Object'].entries(metadata)) {
               storage.set(component[0], component[1]); // TODO A way to resolve component type from its id and create it using metadata?
            }
            return storage;
         },
         {
            getComponents() {
               return KernelArray.From(this.STORAGE.values()) as unknown as [];
            },
            getComponent(componentId) {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               return this.STORAGE.get(componentId) as unknown as any;
            },
         },
      );
   }

   public Block = this.addComponents('Block');
   public Entity = this.addComponents('Entity');
   public ItemStack = this.addComponents('ItemStack');
}

export default new ComponentsPlugin();
