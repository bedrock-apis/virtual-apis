import { MapWithDefaults } from '@bedrock-apis/va-common';
import { va } from '../decorators';
import { Dimension, DimensionTypes } from './dimension';
import { DynamicProperties } from './dynamic-properties';
import { CorePlugin } from '../core-plugin';

export class World extends va.server.class('World', DynamicProperties) {
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

   @va.method('getDimension') public getDimension(rawId: string) {
      // Cached
      const id = CorePlugin.addNamespace(rawId);
      const dimension = this.dimensions.get(id);
      if (dimension) return dimension;

      // Creating
      const type = DimensionTypes.types.find(e => e.typeId === id);
      if (!type) throw new Error(`Dimension '${rawId}' is invalid.`);

      return this.dimensions.getOrCreate(id, () => new Dimension(type));
   }
}

export const world = new World([]);
va.server.constant('world', world);
