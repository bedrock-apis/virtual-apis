import { Plugin } from '@bedrock-apis/va-pluggable';

class EffectsPlugin extends Plugin {
   protected id = 'effects';

   public effects = this.implementWithStorage('Entity', 'inventory', () => new Map(), {});
}

export default new EffectsPlugin();
