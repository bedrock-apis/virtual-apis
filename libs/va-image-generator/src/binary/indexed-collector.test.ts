import { describe, expect, it } from 'vitest';
import { IndexedCollector } from './indexed-collector';

export class IndexedCollectorHash<T, S> {
   public constructor(protected readonly hash: (v: T) => S) {}
   protected readonly MAP = new Map<S, number>();
   protected readonly LIST: T[] = [];

   public toIndex(key: T): number {
      const $ = this.hash(key);
      let value = this.MAP.get($) ?? null;
      if (value === null) {
         this.MAP.set($, (value = this.LIST.length));
         this.LIST.push(key);
      }
      return value;
   }

   public fromIndex(index: number): T | null {
      return this.LIST[index] ?? null;
   }

   public getArray(): T[] {
      return this.LIST;
   }

   public clear() {
      this.MAP.clear();
      this.LIST.length = 0;
   }
}

describe('indexed collector', () => {
   it('woorks', () => {
      const stringCollector = new IndexedCollector<string>();
      const typesCollector = new IndexedCollectorHash((_: { name: string; value: string }) => `${_.name}.${_.value}`); //;new IndexedObjectCollector<{ name: string; value: string }>(stringCollector);

      stringCollector.toIndex('random string');
      stringCollector.toIndex('random string 2');
      stringCollector.toIndex('random string 3');
      stringCollector.toIndex('random string 4');

      const type1 = { name: 'type 1', value: 'aaaa' };
      const type1Index = typesCollector.toIndex(type1);

      expect(typesCollector.getArray().length).toBe(1);
      expect(type1Index).toEqual(0);

      // Another type creation, but before we got bunch of random other calls
      // to show that creating new strings does not affect type indexes
      stringCollector.toIndex('random string 5');
      stringCollector.toIndex('random string 6');

      const type2 = { name: 'type 1', value: 'aaaa bbb' };
      const type2Index = typesCollector.toIndex(type2);

      expect(typesCollector.getArray().length).toBe(2);
      expect(type2Index).toEqual(1);

      // to binary
      const types = typesCollector
         .getArray()
         .map(e => ({ name: stringCollector.toIndex(e.name), value: stringCollector.toIndex(e.value) }));

      // from binary
      function resolveType(index: number) {
         const type = types[index];
         if (!type) throw new Error('Unknown index ' + index);
         return {
            name: stringCollector.fromIndex(type.name),
            value: stringCollector.fromIndex(type.value),
         };
      }

      expect(resolveType(type1Index)).toEqual(type1);
      expect(resolveType(type2Index)).toEqual(type2);
   });
});
