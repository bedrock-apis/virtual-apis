import { Plugin } from '@bedrock-apis/va-pluggable';

class EffectsPlugin extends Plugin {
   protected id = 'effects';

   public effects = this.server.implementWithStorage('Entity', () => new Map(), {});
}

EffectsPlugin.register('effects');
