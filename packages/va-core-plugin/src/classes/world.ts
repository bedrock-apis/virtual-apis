import { CorePlugin, va } from '../core-plugin';

export class World extends va.server.class('World') {
   @va.method('stopMusic')
   public stopMusic() {}

   protected timeOfDay = 0;

   @va.method('setTimeOfDay')
   public setTimeOfDay(timeOfDay: number) {
      this.timeOfDay = timeOfDay;
   }

   @va.method('getTimeOfDay')
   public getTimeOfDay() {
      return this.timeOfDay;
   }
}

export const world = new World();
CorePlugin.registryModuleObjectVariable('@minecraft/server-bindings::world', world);
