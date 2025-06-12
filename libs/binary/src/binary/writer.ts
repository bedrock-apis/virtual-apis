import { IStaticDataProvider, StaticDataProvider } from '../../ref-bapi-nbt/base';

const utf8Encoder = new TextEncoder();

// Use LE alwayes
export class BinaryWriter {
   public static WriteCheckPointUint16(_: IStaticDataProvider, writer: (_: IStaticDataProvider) => void) {
      const provider = new StaticDataProvider(
         new DataView(_.view.buffer, _.view.byteOffset + _.pointer + 2, _.view.byteLength),
         0,
      );
      writer(provider);

      BinaryWriter.WriteUint16(_, provider.pointer);
      _.pointer += provider.pointer;
   }
   public static WriteCheckPointUint32(_: IStaticDataProvider, writer: (_: IStaticDataProvider) => void) {
      const provider = new StaticDataProvider(
         new DataView(_.view.buffer, _.view.byteOffset + _.pointer + 4, _.view.byteLength),
         0,
      );
      writer(provider);
      BinaryWriter.WriteUint32(_, provider.pointer);
      _.pointer += provider.pointer;
   }
   public static WriteUint8(dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setUint8(dataProvider.pointer++, value);
   }
   public static WriteUint16(dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setUint16(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteUint32(dataProvider: IStaticDataProvider, value: number): void {
      dataProvider.view.setUint32(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteBuffer(dataProvider: IStaticDataProvider, value: Uint8Array): void {
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteStringWith(
      lengthWriter: (d: IStaticDataProvider, v: number) => void,
      encoder = utf8Encoder,
      dataProvider: IStaticDataProvider,
      value: string,
   ) {
      const buffer = encoder.encode(value);
      lengthWriter(dataProvider, buffer.length);
      BinaryWriter.WriteBuffer(dataProvider, buffer);
   }
   public static WriteStringU8: (dataProvider: IStaticDataProvider, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint8, utf8Encoder);
   public static WriteStringU16: (dataProvider: IStaticDataProvider, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint16, utf8Encoder);
   public static WriteStringU32: (dataProvider: IStaticDataProvider, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint32, utf8Encoder);
   public static WriteArrayBufferU16(dataProvider: IStaticDataProvider, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteArrayBufferU32(dataProvider: IStaticDataProvider, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.uint8Array.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
}
