import { describe, expect, it } from 'vitest';
import { IndexedCollector } from './indexed-collector';

describe('indexed collector', () => {
   it('woorks', () => {
      const stringCollector = new IndexedCollector<string>();
      const typesCollector = new IndexedCollector((v: { name: string; value: string }) => `${v.name}.${v.value}`);

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
