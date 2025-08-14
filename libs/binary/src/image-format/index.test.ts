import { IndexedCollector } from '@bedrock-apis/common';
import { MetadataType } from '@bedrock-apis/types';
import { MetadataToSerializableTransformer } from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { SystemFileMetadataProvider } from '@bedrock-apis/va-image-generator/src/metadata-provider';
import { describe, expect, it } from 'vitest';
import { BinaryIO } from '../binary/io';
import {
   BinaryImageFormat,
   BinaryIOReader,
   BinarySymbolStruct,
   DataCursorView,
   SafeBinaryIOWriter,
   SerializableMetadata,
} from '../main';

class TestSerializer extends MetadataToSerializableTransformer {
   testTransformType = (m: MetadataType) => this.transformType(m, this.typeRef);
}

class TestBinaryImageFormat extends BinaryImageFormat {
   static testType = this.type;

   static testSymbol = this.symbol;

   static testModuleData = this.moduleData;
}

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
   const provider = new SystemFileMetadataProvider('./bds-docs-stable/metadata/script_modules/');
   cache = await new MetadataToSerializableTransformer().transform(provider);
   return cache;
}

describe('io test', () => {
   it('serialize symbols', { timeout: 5000 }, async () => {
      const data = await getTestData();
      const collector = new IndexedCollector<BinarySymbolStruct>(JSON.stringify);
      for (const module of data.modules) for (const symbol of module.data.symbols) collector.getIndexFor(symbol);
      const symbols = collector.getArrayAndLock();

      for (const symbol of symbols) {
         const a = testMarshal(symbol, m => TestBinaryImageFormat.testSymbol(m));
         expect(a.actual).toEqual((a.expected as unknown as { toJSON(): object }).toJSON());
      }
   });

   it('serialize module', { timeout: 5000 }, async () => {
      const data = await getTestData();
      data.modules = data.modules.slice(0, 10);
      const reread = BinaryImageFormat.read(BinaryImageFormat.write(data));
      const actual = { modules: reread.modules.map(e => BinaryIO.readEncapsulatedData(e)), metadata: reread.metadata };
      const { modules, metadata } = data;
      expect(actual).toEqual({
         modules: modules.map(e => ({
            ...e,
            data: { ...e.data, symbols: e.data.symbols.map(e => (e as unknown as { toJSON(): object }).toJSON()) },
         })),
         metadata,
      });
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
      const a = testMarshal(s, io => TestBinaryImageFormat.testType(io));
      expect(a.actual).toEqual(a.expected);
   });
});
