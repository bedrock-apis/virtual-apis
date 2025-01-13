import { Kernel } from '../../virtual-apis';
import { Plugin } from '../apis/api';

class EffectsPlugin extends Plugin {
   protected id = 'effects';

   public effects = this.implementWithStorage('Entity', 'inventory', () => new Kernel['globalThis::Map'](), {});
}

export default new EffectsPlugin();
