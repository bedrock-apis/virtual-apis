import { StaticDataSource } from './static-data-source';

const utf8Encoder = new TextEncoder();

// Use LE alwayes
export class BinaryWriter {
   public static WriteCheckPointUint16(_: StaticDataSource, writer: (_: StaticDataSource) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.WriteUint16(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static WriteCheckPointUint32(_: StaticDataSource, writer: (_: StaticDataSource) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.WriteUint32(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static WriteUint8(dataProvider: StaticDataSource, value: number): void {
      dataProvider.view.setUint8(dataProvider.pointer++, value);
   }
   public static WriteUint16(dataProvider: StaticDataSource, value: number): void {
      dataProvider.view.setUint16(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteUint32(dataProvider: StaticDataSource, value: number): void {
      dataProvider.view.setUint32(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteBuffer(dataProvider: StaticDataSource, value: Uint8Array): void {
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteStringWith(
      lengthWriter: (d: StaticDataSource, v: number) => void,
      encoder = utf8Encoder,
      dataProvider: StaticDataSource,
      value: string,
   ) {
      const buffer = encoder.encode(value);
      lengthWriter(dataProvider, buffer.length);
      BinaryWriter.WriteBuffer(dataProvider, buffer);
   }
   public static WriteStringU8: (dataProvider: StaticDataSource, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint8, utf8Encoder);
   public static WriteStringU16: (dataProvider: StaticDataSource, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint16, utf8Encoder);
   public static WriteStringU32: (dataProvider: StaticDataSource, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint32, utf8Encoder);
   public static WriteArrayBufferU16(dataProvider: StaticDataSource, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteArrayBufferU32(dataProvider: StaticDataSource, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }

   public static WriteUint16Array(_: StaticDataSource, value: ArrayLike<number>): void {
      const view = _.view;
      let offset = _.pointer;
      for (let i = 0; i < value.length; i++, offset += 2) view.setUint16(offset, value[i] as number, true);
      _.pointer = offset;
   }
}
