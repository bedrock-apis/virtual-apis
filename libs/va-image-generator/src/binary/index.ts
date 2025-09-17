import { BinaryImageFormat, DataCursorView, SerializableMetadata } from '@bedrock-apis/binary';
import { IMAGES_DIR } from '@bedrock-apis/common';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { IMetadataProvider } from '../metadata-provider';
import { MetadataToSerializableTransformer } from './metadata-to-serializable';

export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const startupTime = performance.now();
   const data = await new MetadataToSerializableTransformer().transform(metadataProvider);
   data.jsModules = (await Array.fromAsync(metadataProvider.getJSModules())).map(e => {
      return {
         code: e[1],
         filename: e[0],
         name: `@minecraft/${e[0].match(/[^\\/]+$/)}`,
      };
   });
   let buffer = BinaryImageFormat.write(data, DataCursorView.alloc(1 << 22)); //4MB
   const baseSize = buffer.length;
   writeFileSync(path.join(IMAGES_DIR, 'image.bin'), buffer);
   buffer = gzipSync(buffer);
   writeFileSync(path.join(IMAGES_DIR, 'image.gz'), gzipSync(buffer));

   console.log(
      '✅ Done...\n📦 Size: ->',
      Number((baseSize / 1024).toFixed(2)),
      'kb\n📦 Gzip: ->',
      Number((buffer.length / 1024).toFixed(2)),
      'kb',
      '\n⌚ Time:',
      performance.now() - startupTime,
   );
   return 0;
}
async function extractBDSJSModules(bdsSourceFolder: string): Promise<SerializableMetadata['jsModules']> {
   return [];
}
