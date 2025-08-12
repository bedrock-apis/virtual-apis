import { BaseBinaryIOImageSerializer } from './base-format-io';
import { BinaryImageSerializerIOV1 } from './v1-io';
export * from './base-format-io';
export * from './v1-io';

export const CurrentImageSerializer = (BaseBinaryIOImageSerializer.current = BinaryImageSerializerIOV1);
