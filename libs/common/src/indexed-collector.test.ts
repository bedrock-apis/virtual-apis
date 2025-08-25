import { describe, expect, it } from 'vitest';
import { IndexedAccessor, IndexedCollector } from './indexed-collector';

describe('indexed collector', () => {
   it('woorks', () => {
      const stringCollector = new IndexedCollector<string>();
      const typesCollector = new IndexedCollector((v: { name: string; value: string }) => `${v.name}.${v.value}`);

      stringCollector.getIndexFor('random string');
      stringCollector.getIndexFor('random string 2');
      stringCollector.getIndexFor('random string 3');
      stringCollector.getIndexFor('random string 4');

      const type1 = { name: 'type 1', value: 'aaaa' };
      const type1Index = typesCollector.getIndexFor(type1);

      expect(typesCollector.getArray().length).toBe(1);
      expect(type1Index).toEqual(0);

      // Another type creation, but before we got bunch of random other calls
      // to show that creating new strings does not affect type indexes
      stringCollector.getIndexFor('random string 5');
      stringCollector.getIndexFor('random string 6');

      const type2 = { name: 'type 1', value: 'aaaa bbb' };
      const type2Index = typesCollector.getIndexFor(type2);

      expect(typesCollector.getArray().length).toBe(2);
      expect(type2Index).toEqual(1);

      // to binary
      const stringSlices = stringCollector.getArray();
      const typeSlices = typesCollector
         .getArray()
         .map(e => ({ name: stringCollector.getIndexFor(e.name), value: stringCollector.getIndexFor(e.value) }));

      // from binary
      const stringAccess = new IndexedAccessor(stringSlices);
      const typesAccess = new IndexedAccessor(typeSlices);
      function resolveType(index: number) {
         const type = typesAccess.fromIndex(index);
         return {
            name: stringAccess.fromIndex(type.name),
            value: stringAccess.fromIndex(type.value),
         };
      }

      expect(resolveType(type1Index)).toEqual(type1);
      expect(resolveType(type2Index)).toEqual(type2);
   });
});
