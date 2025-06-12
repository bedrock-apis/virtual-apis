import { CurrentBinaryImageSerializer, StaticDataSource } from '@bedrock-apis/binary';

const buffer = StaticDataSource.Alloc(32 * 2 ** 10); // About 8*1K

CurrentBinaryImageSerializer.WriteGeneralHeader(buffer, {
   metadata: { engine: 0 },
   stringSlices: ['1.21.100.0'],
   version: CurrentBinaryImageSerializer.version,
});
