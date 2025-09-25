import { va } from '../core-plugin';

export class Entity extends va.server.class('Entity') {
   @va.getter('isSwimming')
   public override isSwimming = true;

   @va.getter('isSleeping')
   public override get isSleeping() {
      return true;
   }

   @va.getter('isClimbing')
   public override isClimbing = true;
}
