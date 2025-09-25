import { va } from '../core-plugin';

export class Entity extends va.server.class('Entity') {
   @va.getter('isSwimming')
   public properIsSwimming = true;

   @va.getter('isSleeping')
   public get isSomething() {
      return true;
   }
}
