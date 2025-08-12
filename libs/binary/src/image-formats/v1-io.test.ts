import { MetadataType } from '@bedrock-apis/types';
import { MetadataToSerializableTransformer } from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { describe, expect, it } from 'vitest';
import {
   BinaryImageSerializerIOV1,
   BinaryIOReader,
   BinaryIOWriter,
   BinaryTypeStruct,
   DataCursorView,
   SafeBinaryIOWriter,
} from '../main';
import { BinaryIO } from '../binary/io';

describe('io test', () => {
   class TestSerializer extends MetadataToSerializableTransformer {
      testTransformType = (m: MetadataType) => this.transformType(m, this.typeRef);
   }

   class TestIOSerializer extends BinaryImageSerializerIOV1 {
      static testType = this.type;
   }

   type DeepPartial<T> = T extends Record<string, unknown> ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

   function testType(m: DeepPartial<MetadataType>) {
      const s = new TestSerializer().testTransformType(m as unknown as MetadataType);
      const write = new SafeBinaryIOWriter(
         DataCursorView.alloc(1024 * 4),
         s as object,
      ) as unknown as BinaryIO<BinaryTypeStruct>;
      TestIOSerializer.testType(write);

    write.data.pointer = 0
      const read = new BinaryIOReader(write.data, {}) as unknown as BinaryIO<BinaryTypeStruct>;
      TestIOSerializer.testType(read);

      const actual = read.storage as BinaryTypeStruct;
      const expected = s;
      return { actual, expected };
   }

   it('should serialize and deserialize without problems', () => {
      const a = testType({
         is_bind_type: false,
         is_errorable: true,
         key_type: {
            is_bind_type: false,
            is_errorable: false,
            name: 'string',
         },
         name: 'map',
         value_type: {
            is_bind_type: false,
            is_errorable: false,
            name: 'int32',
            valid_range: {
               max: 2147483647,
               min: -2147483648,
            },
         },
      });
      expect(a.actual).toEqual(a.expected);
   });
});
