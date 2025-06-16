import { NBTTag } from '../tag';
import { IStaticDataProvider } from './data-provider';
import { NBTFormatReader, NBTFormatWriter } from './format';

export class GeneralNBTFormatReader implements NBTFormatReader {
   public constructor(
      public readonly littleEndian: boolean = true,
      public readonly textEncoder = new TextDecoder(),
   ) {}
   static {
      // Performance benefits
      this.prototype.readType = this.prototype[NBTTag.Byte];
   }
   public readType(_: IStaticDataProvider): NBTTag {
      return NBTTag.EndOfCompound;
   }
   public readArrayLength(dataProvider: IStaticDataProvider): number {
      return this[NBTTag.Int32](dataProvider);
   }
   public readStringLength(dataProvider: IStaticDataProvider): number {
      return this[NBTTag.Short](dataProvider);
   }
   public [NBTTag.Byte](dataProvider: IStaticDataProvider): number {
      return dataProvider.view.getUint8(dataProvider.pointer++);
   }
   public [NBTTag.Short](dataProvider: IStaticDataProvider): number {
      const _ = dataProvider.view.getInt16(dataProvider.pointer, this.littleEndian);
      return (dataProvider.pointer += 2), _;
   }
   public [NBTTag.Int32](dataProvider: IStaticDataProvider): number {
      const _ = dataProvider.view.getInt32(dataProvider.pointer, this.littleEndian);
      return (dataProvider.pointer += 4), _;
   }
   public [NBTTag.Long](dataProvider: IStaticDataProvider): bigint {
      const _ = dataProvider.view.getBigInt64(dataProvider.pointer, this.littleEndian);
      return (dataProvider.pointer += 8), _;
   }
   public [NBTTag.Float](dataProvider: IStaticDataProvider): number {
      const _ = dataProvider.view.getFloat32(dataProvider.pointer, this.littleEndian);
      return (dataProvider.pointer += 4), _;
   }
   public [NBTTag.Double](dataProvider: IStaticDataProvider): number {
      const _ = dataProvider.view.getFloat64(dataProvider.pointer, this.littleEndian);
      return (dataProvider.pointer += 8), _;
   }
   public [NBTTag.ByteArray](dataProvider: IStaticDataProvider): Uint8Array {
      const length = this.readArrayLength(dataProvider);
      return dataProvider.uint8Array.subarray(dataProvider.pointer, (dataProvider.pointer += length));
   }
   public [NBTTag.String](dataProvider: IStaticDataProvider): string {
      const length = this.readStringLength(dataProvider);
      return this.textEncoder.decode(
         dataProvider.uint8Array.subarray(dataProvider.pointer, (dataProvider.pointer += length)),
      );
   }
   public [NBTTag.Int32Array](dataProvider: IStaticDataProvider): Int32Array {
      const length = this.readArrayLength(dataProvider);
      const _ = new Int32Array(length);
      const type = NBTTag.Int32;
      for (let i = 0; i < length; i++) _[i] = this[type](dataProvider);
      return _;
   }
   public [NBTTag.LongArray](dataProvider: IStaticDataProvider): BigInt64Array {
      const length = this.readArrayLength(dataProvider);
      const _ = new BigInt64Array(length);
      const type = NBTTag.Long;
      for (let i = 0; i < length; i++) _[i] = this[type](dataProvider);
      return _;
   }
   public [NBTTag.List](dataProvider: IStaticDataProvider): unknown[] {
      const type = this.readType(dataProvider);
      const length = this.readArrayLength(dataProvider);
      if (!(type in this)) throw new SyntaxError('Unexpected NBT token type: ' + type);
      const _: unknown[] = [];
      for (let i = 0; i < length; i++) _[i] = this[type as NBTTag.Byte](dataProvider);
      return _;
   }
   public [NBTTag.Compound](dataProvider: IStaticDataProvider): object {
      const _: Record<string, unknown> = Object.create(null);
      while (true) {
         const type = this.readType(dataProvider);
         if (type === NBTTag.EndOfCompound) break;
         const key = this[NBTTag.String](dataProvider);
         _[key] = this[type](dataProvider);
      }
      Reflect.setPrototypeOf(_, Object.prototype);
      return _;
   }
}
export class GeneralNBTFormatWriter implements NBTFormatWriter {
   public constructor(
      public readonly littleEndian: boolean = true,
      public readonly textEncoder = new TextEncoder(),
   ) {}

   static {
      // Performance benefits
      this.prototype.writeType = this.prototype[NBTTag.Byte];
   }
   public writeType(dataProvider: IStaticDataProvider, value: NBTTag): void {
      this[NBTTag.Byte](dataProvider, value);
   }
   public writeArrayLength(dataProvider: IStaticDataProvider, length: number): void {
      this[NBTTag.Int32](dataProvider, length);
   }
   public writeStringLength(dataProvider: IStaticDataProvider, length: number): void {
      this[NBTTag.Short](dataProvider, length);
   }

   public [NBTTag.Byte](dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setUint8(dataProvider.pointer++, value);
   }
   public [NBTTag.Short](dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setInt16(dataProvider.pointer, value, this.littleEndian);
      dataProvider.pointer += 2;
   }
   public [NBTTag.Int32](dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setInt32(dataProvider.pointer, value, this.littleEndian);
      dataProvider.pointer += 4;
   }
   public [NBTTag.Long](dataProvider: IStaticDataProvider, value: bigint): void {
      dataProvider.view.setBigInt64(dataProvider.pointer, value, this.littleEndian);
      dataProvider.pointer += 8;
   }
   public [NBTTag.Float](dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setFloat32(dataProvider.pointer, value, this.littleEndian);
      dataProvider.pointer += 4;
   }
   public [NBTTag.Double](dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setFloat64(dataProvider.pointer, value, this.littleEndian);
      dataProvider.pointer += 8;
   }
   public [NBTTag.ByteArray](dataProvider: IStaticDataProvider, value: Uint8Array): void {
      this.writeArrayLength(dataProvider, value.length);
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }

   public [NBTTag.String](dataProvider: IStaticDataProvider, value: string): void {
      const encoded = this.textEncoder.encode(value);
      this.writeStringLength(dataProvider, encoded.length);
      dataProvider.uint8Array.set(encoded, dataProvider.pointer);
      dataProvider.pointer += encoded.length;
   }

   public [NBTTag.Int32Array](dataProvider: IStaticDataProvider, value: Int32Array): void {
      const length = value.length;
      this.writeArrayLength(dataProvider, length);
      for (let i = 0; i < length; i++) this[NBTTag.Int32](dataProvider, value[i]!);
   }

   public [NBTTag.LongArray](dataProvider: IStaticDataProvider, value: BigInt64Array): void {
      const length = value.length;
      this.writeArrayLength(dataProvider, length);
      for (let i = 0; i < length; i++) this[NBTTag.Long](dataProvider, value[i]!);
   }

   public [NBTTag.List](dataProvider: IStaticDataProvider, value: unknown[], typeHint?: NBTTag): void {
      this.writeType(
         dataProvider,
         (typeHint ??= GeneralNBTFormatWriter.determineType(value[0] ?? 0, this.NUMBER_FORMAT)),
      );
      this.writeArrayLength(dataProvider, value.length);
      if (!(typeHint in this)) throw new SyntaxError(`Unexpected NBT token type: ${typeHint}`);

      for (let i = 0; i < value.length; i++) this[typeHint as NBTTag.Byte](dataProvider, value[i] as number);
   }

   public [NBTTag.Compound](dataProvider: IStaticDataProvider, value: Record<string, unknown>): void {
      // We don't use getOwnPropertyNames bc it would return methods from prototype abused like objects "in theory"
      for (const key of Object.keys(value)) {
         const v = value[key];
         const type = GeneralNBTFormatWriter.determineType(v, this.NUMBER_FORMAT);
         if (type === NBTTag.EndOfCompound) return;
         this.writeType(dataProvider, type);
         this[NBTTag.String](dataProvider, key);
         // Crazy TS stuff
         this[type](dataProvider, v as never);
      }
      this.writeType(dataProvider, NBTTag.EndOfCompound);
   }

   public NUMBER_FORMAT = NBTTag.Float;
   public static determineType(value: unknown, numberFormat: NBTTag): NBTTag {
      if (typeof value === 'number') return numberFormat;
      if (typeof value === 'bigint') return NBTTag.Long;
      if (typeof value === 'string') return NBTTag.String;
      if (Array.isArray(value)) return NBTTag.List;
      if (value instanceof Uint8Array) return NBTTag.ByteArray;
      if (value instanceof Int32Array) return NBTTag.Int32Array;
      if (value instanceof BigInt64Array) return NBTTag.LongArray;
      if (value instanceof Int8Array) return NBTTag.ByteArray;
      if (value instanceof Uint32Array) return NBTTag.Int32Array;
      if (value instanceof BigUint64Array) return NBTTag.LongArray;
      if (typeof value === 'object') return NBTTag.Compound;
      return NBTTag.EndOfCompound;
   }
}
