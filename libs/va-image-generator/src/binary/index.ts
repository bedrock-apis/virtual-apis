import { CurrentBinaryImageSerializer, DataCursorView } from '@bedrock-apis/binary';
import { MODULES_DIR } from '@bedrock-apis/common';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { IMetadataProvider } from '../metadata-provider';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';

const CIS = CurrentBinaryImageSerializer;
export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const startupTime = performance.now();
   const { modules, metadata } = await new MetadataToSerializableTransformer().transform(metadataProvider);

   const buffer = DataCursorView.Alloc(2 ** 16 * 3); // 196608 bytes -> 192 kb
   console.log(CIS.version);
   CIS.WriteGeneralHeader(buffer, metadata);
   for (const { metadata, id, data, stats } of modules) {
      const size = buffer.pointer;
      console.log(`Write Module ${id}`, stats.uniqueTypes);
      CIS.WriteFieldHeader(buffer, metadata);
      CIS.WriteModuleField(buffer, data);
      console.log(`Module '${id}', size: ${buffer.pointer - size}`);
   }

   const fileBuffer = buffer.getBuffer();
   writeFileSync(path.join(MODULES_DIR, 'image.bin'), fileBuffer);
   console.log(
      '✅ Done...\n📦 Size: ->',
      Number((fileBuffer.length / 1024).toFixed(2)),
      'kb',
      '\n⌚ Time:',
      performance.now() - startupTime,
   );
   return 0;
}

export async function mainNew(metadataProvider: IMetadataProvider): Promise<number> {
   const startupTime = performance.now();
   const { modules, metadata } = await new MetadataToSerializableTransformer().transform(metadataProvider);

   const buffer = DataCursorView.Alloc(2 ** 16 * 3); // 196608 bytes -> 192 kb
   console.log(CIS.version);
   CIS.WriteGeneralHeader(buffer, metadata);
   for (const { metadata, id, data, stats } of modules) {
      const size = buffer.pointer;
      console.log(`Write Module ${id}`, stats.uniqueTypes);
      CIS.WriteFieldHeader(buffer, metadata);
      CIS.WriteModuleField(buffer, data);
      console.log(`Module '${id}', size: ${buffer.pointer - size}`);
   }

   const fileBuffer = buffer.getBuffer();
   writeFileSync(path.join(MODULES_DIR, 'image.bin'), fileBuffer);
   console.log(
      '✅ Done...\n📦 Size: ->',
      Number((fileBuffer.length / 1024).toFixed(2)),
      'kb',
      '\n⌚ Time:',
      performance.now() - startupTime,
   );
   return 0;
}
