import { va } from '../core-plugin';

class System extends va.server.class('System') {
   @va.method('run')
   public run(fn: () => void) {
      setImmediate(fn);
      return 0;
   }

   @va.method('waitTicks')
   public waitTicks(ticks: number) {
      return new Promise<void>(r => setTimeout(r, ticks * 50));
   }
}

export const system = new System();
va.server.constant('system', system);
