import { MetadataType, MetadataTypeName } from '@bedrock-apis/types';
import { MetadataToSerializableTransformer } from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { describe, expect, it } from 'vitest';
import {
   BinaryImageSerializerIOV1,
   BinaryIOReader,
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

   type DeepPartial<T> =
      T extends Record<string, unknown>
         ? { [K in keyof T]?: DeepPartial<T[K]> }
         : T extends (infer A)[]
           ? DeepPartial<A>[]
           : T extends MetadataTypeName
             ? string
             : T;

   function testType(m: DeepPartial<MetadataType>) {
      const s = new TestSerializer().testTransformType(m as unknown as MetadataType);
      const write = new SafeBinaryIOWriter(
         DataCursorView.alloc(1024 * 4),
         s as object,
      ) as unknown as BinaryIO<BinaryTypeStruct>;
      TestIOSerializer.testType(write);

      write.data.pointer = 0;
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

   it('should serialize error', () => {
      const a = testType({
         is_bind_type: false,
         is_errorable: false,
         name: 'Error',
      });

      expect(a.actual).toEqual(a.expected);
   });

   it('should serialize error types', () => {
      const a = testType({
         error_types: [
            {
               from_module: {
                  name: '@minecraft/common',
                  uuid: '77ec12b4-1b2b-4c98-8d34-d1cd63f849d5',
                  version: '1.1.0',
               },
               is_bind_type: true,
               is_errorable: false,
               name: 'EngineError',
            },
            {
               is_bind_type: false,
               is_errorable: false,
               name: 'Error',
            },
            {
               from_module: {
                  name: '@minecraft/common',
                  uuid: '77ec12b4-1b2b-4c98-8d34-d1cd63f849d5',
                  version: '1.1.0',
               },
               is_bind_type: true,
               is_errorable: false,
               name: 'InvalidArgumentError',
            },
            {
               is_bind_type: true,
               is_errorable: false,
               name: 'NamespaceNameError',
            },
         ],
         is_bind_type: true,
         is_errorable: true,
         name: 'AimAssistPreset',
      });

      expect(a.actual).toEqual(a.expected);
   });
});
