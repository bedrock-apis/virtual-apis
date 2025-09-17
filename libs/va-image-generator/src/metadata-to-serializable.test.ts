import { describe, expect, it } from 'vitest';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';

describe('metadata to serializable', () => {
   it('should preserve indexes', async () => {
      class Test extends MetadataToSerializableTransformer {
         testTypes = this.transformTypes;
         typeRefPublic = this.typeRef;
      }
      const serializer = new Test();
      // @ts-expect-error
      serializer.typeRefPublic({ name: 'map', value_type: { name: 'string' }, key_type: { name: 'this' } });

      expect(serializer.testTypes()).toMatchInlineSnapshot(`
        [
          {
            "extendedRefs": [
              1,
              2,
            ],
            "flags": 258,
          },
          {
            "flags": 2,
          },
          {
            "flags": 4,
          },
        ]
      `);
   });
});
