// import { BinaryImageFormat, DataCursorView } from '@bedrock-apis/va-binary';
// import { IMAGES_DIR } from '@bedrock-apis/va-common';
// import { writeFileSync } from 'node:fs';
// import path from 'node:path';
// import { gzipSync } from 'node:zlib';
// import { IMetadataProvider } from './metadata-provider';
// import { MetadataToSerializableTransformer } from './metadata-to-serializable';

// TODO Replace with gen command that will run modulesProvider.write()

// export async function main(metadataProvider: IMetadataProvider): Promise<number> {
//    const startupTime = performance.now();
//    const data = await new MetadataToSerializableTransformer().transform(metadataProvider);
//    let buffer = BinaryImageFormat.write(data, DataCursorView.alloc());
//    const baseSize = buffer.length;
//    writeFileSync(path.join(IMAGES_DIR, 'image.bin'), buffer);
//    buffer = gzipSync(buffer);
//    writeFileSync(path.join(IMAGES_DIR, 'image.gz'), gzipSync(buffer));

//    console.log(
//       '✅ Done...\n📦 Size: ->',
//       Number((baseSize / 1024).toFixed(2)),
//       'kb\n📦 Gzip: ->',
//       Number((buffer.length / 1024).toFixed(2)),
//       'kb',
//       '\n⌚ Time:',
//       ~~(performance.now() - startupTime),
//       'ms',
//    );
//    return 0;
// }
