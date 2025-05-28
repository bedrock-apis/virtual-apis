import { Kernel } from '@bedrock-apis/kernel-isolation';
import { Plugin } from '@bedrock-apis/va-pluggable';

class EffectsPlugin extends Plugin {
   protected id = 'effects';

   public effects = this.implementWithStorage('Entity', 'inventory', () => new Kernel['globalThis::Map'](), {});
}

export default new EffectsPlugin();
