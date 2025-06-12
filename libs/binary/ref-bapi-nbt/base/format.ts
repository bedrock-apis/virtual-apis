//@es
import { NBTTag } from '../tag';
import { IStaticDataProvider } from './data-provider';

export interface NBTFormatReader {
   readType(dataProvider: IStaticDataProvider): NBTTag;
   readStringLength(dataProvider: IStaticDataProvider): number;
   readArrayLength(dataProvider: IStaticDataProvider): number;

   [NBTTag.Byte](dataProvider: IStaticDataProvider): number;
   [NBTTag.Short](dataProvider: IStaticDataProvider): number;
   [NBTTag.Int32](dataProvider: IStaticDataProvider): number;
   [NBTTag.Long](dataProvider: IStaticDataProvider): bigint;
   [NBTTag.Float](dataProvider: IStaticDataProvider): number;
   [NBTTag.Double](dataProvider: IStaticDataProvider): number;
   [NBTTag.ByteArray](dataProvider: IStaticDataProvider): Uint8Array;

   [NBTTag.String](dataProvider: IStaticDataProvider): string;
   [NBTTag.Int32Array](dataProvider: IStaticDataProvider): Int32Array;
   [NBTTag.LongArray](dataProvider: IStaticDataProvider): BigInt64Array;
   [NBTTag.List](dataProvider: IStaticDataProvider): unknown[];
   [NBTTag.Compound](dataProvider: IStaticDataProvider): object;
}
export interface NBTFormatWriter {
   writeType(dataProvider: IStaticDataProvider, value: NBTTag): void;
   writeStringLength(dataProvider: IStaticDataProvider, length: number): void;
   writeArrayLength(dataProvider: IStaticDataProvider, length: number): void;

   [NBTTag.Byte](dataProvider: IStaticDataProvider, value: number): void;
   [NBTTag.Short](dataProvider: IStaticDataProvider, value: number): void;
   [NBTTag.Int32](dataProvider: IStaticDataProvider, value: number): void;
   [NBTTag.Long](dataProvider: IStaticDataProvider, value: bigint): void;
   [NBTTag.Float](dataProvider: IStaticDataProvider, value: number): void;
   [NBTTag.Double](dataProvider: IStaticDataProvider, value: number): void;
   [NBTTag.ByteArray](dataProvider: IStaticDataProvider, value: Uint8Array): void;

   [NBTTag.String](dataProvider: IStaticDataProvider, value: string): void;
   [NBTTag.Int32Array](dataProvider: IStaticDataProvider, value: Int32Array): void;
   [NBTTag.LongArray](dataProvider: IStaticDataProvider, value: BigInt64Array): void;
   [NBTTag.List](dataProvider: IStaticDataProvider, value: unknown[]): void;
   [NBTTag.Compound](dataProvider: IStaticDataProvider, value: object): void;
}
