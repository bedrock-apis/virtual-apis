import { describe, expect, it } from 'vitest';
import { IndexedCollector, IndexedObjectCollector } from './indexed-collector';

const otherSymbol = { name: 0, value: 0 };

describe('indexed collector', () => {
   it('woorks', () => {
      const stringCollector = new IndexedCollector<string>();
      const typesCollector = new IndexedObjectCollector<{ name: string; value: string }>(stringCollector);

      stringCollector.toIndex('random string');
      stringCollector.toIndex('random string 2');
      stringCollector.toIndex('random string 3');
      stringCollector.toIndex('random string 4');

      const type1Index = typesCollector.toIndex({ name: 'type 1', value: 'aaaa' });

      expect(typesCollector.getArray().length).toMatchInlineSnapshot(`1`);
      expect(type1Index).toMatchInlineSnapshot(`4`);
      expect(type1Index).toEqual(stringCollector.toIndex('type 1'));

      // Another type creation, but before we got bunch of random other calls
      stringCollector.toIndex('random string 5');
      stringCollector.toIndex('random string 6');

      const type2Index = typesCollector.toIndex({ name: 'type 1', value: 'aaaa bbb' });

      expect(typesCollector.getArray().length).toMatchInlineSnapshot(`2`);
      expect(type2Index).toMatchInlineSnapshot(`7`);
      expect(type2Index).toEqual(stringCollector.toIndex('$type 1'));

      // to binary
      const symbols = [
         otherSymbol,
         otherSymbol,
         otherSymbol,
         ...typesCollector
            .getArray()
            .map(e => ({ name: stringCollector.toIndex(e.name), value: stringCollector.toIndex(e.value) })),
         otherSymbol,
         otherSymbol,
         otherSymbol,
      ];

      // from binary
      function getSymbolByName(name: string) {
         const i = stringCollector.toIndex(name);
         for (const symbol of symbols) {
            if (symbol.name === i) return symbol;
         }
      }

      // no indexing typesCollector.getArray at all
      expect(getSymbolByName('type 1')).toMatchInlineSnapshot(`
        {
          "name": 4,
          "value": 8,
        }
      `);
      expect(getSymbolByName('$type 1')).toMatchInlineSnapshot(`
        {
          "name": 7,
          "value": 9,
        }
      `);
   });
});
