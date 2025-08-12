import { BaseBinaryIOImageSerializer, BinaryIOReader } from '@bedrock-apis/binary';
import { MODULES_DIR } from '@bedrock-apis/common';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { IMetadataProvider } from '../metadata-provider';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';

export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const startupTime = performance.now();
   const data = await new MetadataToSerializableTransformer().transform(metadataProvider);

   // @ts-expect-error for testing
   data.modules = [data.modules[0]];

   writeFileSync('original.json', JSON.stringify(data, null, 2));

   const buffer = BaseBinaryIOImageSerializer.write(data);

   writeFileSync(path.join(MODULES_DIR, 'image.bin'), buffer);

   const read = BaseBinaryIOImageSerializer.read(buffer);
   read.modules.forEach(e => BinaryIOReader.readEncapsulatedData(e));

   writeFileSync('write.json', JSON.stringify(read, null, 2));

   console.log(
      '✅ Done...\n📦 Size: ->',
      Number((buffer.length / 1024).toFixed(2)),
      'kb',
      '\n⌚ Time:',
      performance.now() - startupTime,
   );
   return 0;
}
