import { Kernel } from '../api-builder';
import { Plugin } from '../plugin-api/api';

class EffectsPlugin extends Plugin {
   protected id = 'effects';

   public effects = this.implementWithStorage('Entity', 'inventory', () => new Kernel['globalThis::Map'](), {});
}

export default new EffectsPlugin();
