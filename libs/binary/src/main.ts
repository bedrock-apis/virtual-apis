import { StaticDataProvider } from "../ref-bapi-nbt/base";
import { ImageModuleFormatV1 } from "./image-formats";

export * from "./binary";
export * from "./image-formats";

const data = StaticDataProvider.alloc(256);
ImageModuleFormatV1.writeMetadata(data, {test: 5});
console.log(data.uint8Array.subarray(0, data.pointer));
data.pointer = 0;
console.log(ImageModuleFormatV1.readMetadata(data));