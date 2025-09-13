import { Plugin } from '@bedrock-apis/va-pluggable';

// ConMaster forgive me its stub don't stab me with knife for this
// i know you want to create your own event loop similiar to mc

export class SystemPlugin extends Plugin {
   protected _ = this.server.implement('System', {
      run(callback) {
         setImmediate(callback);
         return 0;
      },
      waitTicks(ticks) {
         return new Promise(r => setTimeout(r, ticks * 50));
      },
   });
}
SystemPlugin.register('system');
