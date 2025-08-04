import { BaseBinaryIOImageSerializer } from './base-format-io';
import { BinaryImageSerializerV1 } from './v1';
import { BinaryImageSerializerIOV1 } from './v1-io';
export * from './base-format-io';
export * from './v1-io';

export * from './v1';
export const CurrentBinaryImageSerializer = BinaryImageSerializerV1;
BaseBinaryIOImageSerializer.current = BinaryImageSerializerIOV1;
