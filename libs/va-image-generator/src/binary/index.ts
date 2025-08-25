import { BinaryImageFormat } from '@bedrock-apis/binary';
import { IMAGES_DIR } from '@bedrock-apis/common';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { IMetadataProvider } from '../metadata-provider';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';

export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const startupTime = performance.now();
   const data = await new MetadataToSerializableTransformer().transform(metadataProvider);
   const buffer = BinaryImageFormat.write(data);

   writeFileSync(path.join(IMAGES_DIR, 'image.bin'), buffer);

   console.log(
      '✅ Done...\n📦 Size: ->',
      Number((buffer.length / 1024).toFixed(2)),
      'kb',
      '\n⌚ Time:',
      performance.now() - startupTime,
   );
   return 0;
}
