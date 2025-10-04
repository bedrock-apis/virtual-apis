import { MapWithDefaults } from '@bedrock-apis/va-common';
import { va } from '../core-plugin';
import { Dimension, DimensionTypes } from './dimension';

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

   @va.method('getDay') public getDay() {
      return 11512;
   }

   protected dimensions = new MapWithDefaults<string, Dimension>();

   @va.method('getDimension') public getDimension(id: string) {
      const type = DimensionTypes.types.find(e => e.typeId === id);
      if (!type) throw new Error('unknown dimension ' + id);
      return va.asHandle(this.dimensions.getOrCreate(id, () => new Dimension(type)));
   }
}

export const world = new World();
va.server.constant('world', world);
