import { Plugin } from './api';

// Only types test

class TestPlugin extends Plugin {
   public a = this.serverBeta.implementWithStorage(
      'World',
      () => ({ a: this.serverBeta.resolve('MoonPhase').FirstQuarter, b: this.serverBeta.resolve('Difficulty').Easy }),
      {},
   );
}
TestPlugin.register('etest');
