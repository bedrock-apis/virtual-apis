import { DataCursorView } from './data-cursor-view';

const utf8Encoder = new TextEncoder();

// Use LE always
export class BinaryWriter {
   public static WriteCheckPointUint16(_: DataCursorView, writer: (_: DataCursorView) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.WriteUint16(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static WriteCheckPointUint32(_: DataCursorView, writer: (_: DataCursorView) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.WriteUint32(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static WriteUint8(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint8(dataProvider.pointer++, value);
   }
   public static WriteUint16(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint16(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteUint32(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint32(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static WriteFloat64(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setFloat64(dataProvider.pointer, value, true);
      dataProvider.pointer += 8;
   }
   public static WriteBuffer(dataProvider: DataCursorView, value: Uint8Array): void {
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteStringWith(
      lengthWriter: (d: DataCursorView, v: number) => void,
      encoder = utf8Encoder,
      dataProvider: DataCursorView,
      value: string,
   ) {
      const buffer = encoder.encode(value);
      lengthWriter(dataProvider, buffer.length);
      BinaryWriter.WriteBuffer(dataProvider, buffer);
   }
   public static WriteStringU8: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint8, utf8Encoder);
   public static WriteStringU16: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint16, utf8Encoder);
   public static WriteStringU32: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.WriteStringWith.bind(null, BinaryWriter.WriteUint32, utf8Encoder);
   public static WriteArrayBufferU16(dataProvider: DataCursorView, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static WriteArrayBufferU32(dataProvider: DataCursorView, value: Uint8Array): void {
      BinaryWriter.WriteUint16(dataProvider, value.length);
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }

   public static WriteUint16Array(_: DataCursorView, value: ArrayLike<number>): void {
      const view = _.view;
      let offset = _.pointer;
      for (let i = 0; i < value.length; i++, offset += 2) view.setUint16(offset, value[i] as number, true);
      _.pointer = offset;
   }
}
