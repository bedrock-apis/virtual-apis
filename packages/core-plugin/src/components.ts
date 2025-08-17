import { PluginWithConfig } from '@bedrock-apis/va-pluggable';

const TARGETS = ['Entity', 'Block', 'ItemStack'] as const;
type Targets = (typeof TARGETS)[number];

type ComponentsMetadata = Record<string, unknown>;

interface Config {
   componentsMetadata: Record<Targets, ComponentsMetadata>;
}

class ComponentsPlugin extends PluginWithConfig<Config> {
   protected id = 'components';

   // TODO Pull data from bds-dump
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
            const storage = new Map<string, unknown>();
            const metadata = this.config.componentsMetadata[target];
            for (const component of Object.entries(metadata)) {
               storage.set(component[0], component[1]); // TODO A way to resolve component type from its id and create it using metadata?
            }
            return storage;
         },
         {
            getComponents() {
               return Array.from(this.STORAGE.values()) as unknown as [];
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
