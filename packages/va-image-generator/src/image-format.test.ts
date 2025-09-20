import { BinaryIO, BinaryIOReader, DataCursorView, SafeBinaryIOWriter } from '@bedrock-apis/va-binary';
import { IndexedCollector } from '@bedrock-apis/va-common';
import { MetadataType } from '@bedrock-apis/va-types';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { modulesProvider } from './dump-provider';
import { BinaryImageFormat } from './image-format';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';
import { BinarySymbolStruct, SerializableMetadata } from './types';

class TestSerializer extends MetadataToSerializableTransformer {
   testTransformType = (m: MetadataType) => this.transformType(m, this.typeRef);
}

const imageFormat = new (class TestBinaryImageFormat extends BinaryImageFormat {
   testType = this.type;
   testSymbol = this.symbol;
   testModuleData = this.moduleData;
})();

const view = DataCursorView.alloc(1024 * 1024 * 1024);
function testMarshal<T extends object>(expected: T, marshal: (m: BinaryIO<T>) => void) {
   view.pointer = 0;
   const write = new SafeBinaryIOWriter(view, expected) as unknown as BinaryIO<T>;
   marshal(write);

   write.data.pointer = 0;
   const read = new BinaryIOReader(write.data, {}) as unknown as BinaryIO<T>;
   marshal(read);

   return { actual: read.storage, expected };
}

let cache: SerializableMetadata | undefined;

async function getTestData() {
   if (cache) return cache;
   cache = await modulesProvider.read(path.resolve(import.meta.dirname, '../dist'));
   cache.modules.forEach(e => BinaryIO.readEncapsulatedData(e));
   return cache!;
}

describe('io test', () => {
   it('serialize symbols', { timeout: 5000 }, async () => {
      const data = await getTestData();
      const collector = new IndexedCollector<BinarySymbolStruct>(JSON.stringify);
      for (const module of data.modules) {
         for (let symbol of module.data.symbols) collector.getIndexFor(symbol);
      }

      const symbols = collector.getArrayAndLock();

      for (const symbol of symbols) {
         const a = testMarshal(symbol, m => imageFormat.testSymbol(m));
         expect(a.actual).toEqual((a.expected as any)?.toJSON?.() ?? a.expected);
      }
   });

   it('serialize module', { timeout: 5000 }, async () => {
      const data = await getTestData();
      data.modules = data.modules.slice(0, 10);
      const reread = imageFormat.read(imageFormat.write(data));

      expect(reread.metadata).toEqual(data.metadata);
      expect(reread.modules.map(e => BinaryIO.readEncapsulatedData(e))).toEqual(data.modules);
   });

   it.each([
      {
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
      },
      {
         is_bind_type: false,
         is_errorable: false,
         name: 'Error',
      },
      {
         is_bind_type: false,
         is_errorable: true,
         name: 'undefined',
      },
      {
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
      },
   ])('serialize types', e => {
      const s = new TestSerializer().testTransformType(e as unknown as MetadataType);
      const a = testMarshal(s, io => imageFormat.testType(io));
      expect(a.actual).toEqual(a.expected);
   });
});
