import { GeneralNBTFormatReader, GeneralNBTFormatWriter, StaticDataProvider } from '../ref-bapi-nbt/base';
import { StaticNBT } from '../ref-bapi-nbt/nbt';
import { BinaryImageSerializerV1 } from './image-formats';

export * from './binary';
export * from './image-formats';

const data = StaticDataProvider.alloc(256);
BinaryImageSerializerV1.writeMetadata(data, { test: 5 });
//console.log(data.uint8Array.subarray(0, data.pointer));
data.pointer = 0;
//console.log(ImageModuleFormatV1.readMetadata(data));
import { readFileSync } from 'node:fs';

const arrayBuffer = readFileSync('./level.dat');
const view = new DataView(arrayBuffer.buffer, arrayBuffer.byteOffset, arrayBuffer.byteLength);
const ttt = new StaticDataProvider(view, 8);
const format = new StaticNBT(new GeneralNBTFormatReader(), new GeneralNBTFormatWriter());

console.time('NBT 1000x');
for (let i = 0; i < 1_000; i++) {
   ttt.pointer = 8;
   format.readProperty(ttt);
}
console.timeEnd('NBT 1000x');
