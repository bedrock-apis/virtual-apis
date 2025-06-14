import { CurrentBinaryImageSerializer, StaticDataSource } from '@bedrock-apis/binary';
import { MODULES_DIR } from '@bedrock-apis/common';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { IMetadataProvider } from '../metadata-provider';
import { MetadataToSerializable } from './metadata-to-serializable';

const CIS = CurrentBinaryImageSerializer;
export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const { modules, metadata } = await new MetadataToSerializable().serialize(metadataProvider);

   const buffer = StaticDataSource.Alloc(2 ** 16 * 3); // 65536 bytes -> 64 kb
   console.log(CIS.version);
   CIS.WriteGeneralHeader(buffer, metadata);
   for (const { metadata, id, data, stats } of modules) {
      console.log(`Write Module ${id}`, stats.uniqueTypes);
      CIS.WriteFieldHeader(buffer, metadata);
      CIS.WriteModuleField(buffer, data);
   }

   const fileBuffer = buffer.getBuffer();
   writeFileSync(path.join(MODULES_DIR, 'image.bin'), fileBuffer);
   console.log('Done. Size: ', Number((fileBuffer.length / 1024).toFixed(2)), 'kb');
   return 0;
}
