//@es
import { NBTTag } from '../tag';
import { StaticDataProvider } from './data-provider';

export interface NBTFormatReader {
   readType(dataProvider: StaticDataProvider): NBTTag;
   readStringLength(dataProvider: StaticDataProvider): number;
   readArrayLength(dataProvider: StaticDataProvider): number;

   [NBTTag.Byte](dataProvider: StaticDataProvider): number;
   [NBTTag.Short](dataProvider: StaticDataProvider): number;
   [NBTTag.Int32](dataProvider: StaticDataProvider): number;
   [NBTTag.Long](dataProvider: StaticDataProvider): bigint;
   [NBTTag.Float](dataProvider: StaticDataProvider): number;
   [NBTTag.Double](dataProvider: StaticDataProvider): number;
   [NBTTag.ByteArray](dataProvider: StaticDataProvider): Uint8Array;

   [NBTTag.String](dataProvider: StaticDataProvider): string;
   [NBTTag.Int32Array](dataProvider: StaticDataProvider): Int32Array;
   [NBTTag.LongArray](dataProvider: StaticDataProvider): BigInt64Array;
   [NBTTag.List](dataProvider: StaticDataProvider): unknown[];
   [NBTTag.Compound](dataProvider: StaticDataProvider): object;
}
export interface NBTFormatWriter {
   writeType(dataProvider: StaticDataProvider, value: NBTTag): void;
   writeStringLength(dataProvider: StaticDataProvider, length: number): void;
   writeArrayLength(dataProvider: StaticDataProvider, length: number): void;

   [NBTTag.Byte](dataProvider: StaticDataProvider, value: number): void;
   [NBTTag.Short](dataProvider: StaticDataProvider, value: number): void;
   [NBTTag.Int32](dataProvider: StaticDataProvider, value: number): void;
   [NBTTag.Long](dataProvider: StaticDataProvider, value: bigint): void;
   [NBTTag.Float](dataProvider: StaticDataProvider, value: number): void;
   [NBTTag.Double](dataProvider: StaticDataProvider, value: number): void;
   [NBTTag.ByteArray](dataProvider: StaticDataProvider, value: Uint8Array): void;

   [NBTTag.String](dataProvider: StaticDataProvider, value: string): void;
   [NBTTag.Int32Array](dataProvider: StaticDataProvider, value: Int32Array): void;
   [NBTTag.LongArray](dataProvider: StaticDataProvider, value: BigInt64Array): void;
   [NBTTag.List](dataProvider: StaticDataProvider, value: unknown[]): void;
   [NBTTag.Compound](dataProvider: StaticDataProvider, value: object): void;
}
