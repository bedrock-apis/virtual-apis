// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Needs rewrite

import { Plugin } from '@bedrock-apis/va-pluggable';

export class CommandPlugin extends Plugin {
   protected dimension = this.server.implement('Dimension', {
      runCommand(commandString) {
         return { successCount: 0 };
      },
   });

   protected player = this.server.implement('Player', {
      runCommand(commandString) {
         return { successCount: 0 };
      },
   });

   protected entity = this.server.implement('Entity', {
      runCommand(commandString) {
         return { successCount: 0 };
      },
   });
}
