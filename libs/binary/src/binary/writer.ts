import { DataCursorView } from './data-cursor-view';
import { BinaryIO } from './io';

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

type WriteKey = string;

export class BinaryIOWriter extends BinaryIO<object & Partial<Record<WriteKey, unknown>>> {
   protected override getLengthUint8(key: string): number {
      return this.writeUint8((this.storage[key] as ArrayLike<unknown>).length);
   }
   protected override getLengthUint16(key: string): number {
      return this.writeUint16((this.storage[key] as ArrayLike<unknown>).length);
   }
   protected override getLengthUint32(key: string): number {
      return this.writeUint32((this.storage[key] as ArrayLike<unknown>).length);
   }
   public override varuint32(key: string): this {
      throw new Error('Method not implemented.');
   }

   public override bool(key: never): this {
      return this.writeUint8(this.storage[key] ? 1 : 0), this;
   }

   public uint8(key: WriteKey) {
      return this.writeUint8(this.storage[key] as number), this;
   }
   protected writeUint8(value: number) {
      return this.data.view.setUint8(this.data.pointer++, value), value;
   }

   public uint16(key: WriteKey) {
      return this.writeUint16(this.storage[key] as number), this;
   }
   protected writeUint16(value: number) {
      return this.data.view.setUint16(this.data.pointer, value, true), (this.data.pointer += 2), value;
   }

   public uint32(key: WriteKey) {
      return this.writeUint32(this.storage[key] as number), this;
   }
   protected writeUint32(value: number) {
      return this.data.view.setUint32(this.data.pointer, value, true), (this.data.pointer += 4), value;
   }

   public float64(key: WriteKey) {
      this.data.view.setFloat64(this.data.pointer, this.storage[key] as number, true);
      this.data.pointer += 8;
      return this;
   }

   private writeBuffer(value: Uint8Array) {
      this.data.buffer.set(value, this.data.pointer);
      this.data.pointer += value.length;
      return this;
   }

   protected string(key: string, _: number, encoder = utf8Encoder) {
      return this.writeBuffer(encoder.encode(this.storage[key] as string));
   }

   // public WriteArrayBufferU16(dataProvider: DataCursorView, value: Uint8Array): void {
   //    BinaryWriter.WriteUint16(dataProvider, value.length);
   //    dataProvider.buffer.set(value, dataProvider.pointer);
   //    dataProvider.pointer += value.length;
   // }
   // public WriteArrayBufferU32(dataProvider: DataCursorView, value: Uint8Array): void {
   //    BinaryWriter.WriteUint16(dataProvider, value.length);
   //    dataProvider.buffer.set(value, dataProvider.pointer);
   //    dataProvider.pointer += value.length;
   // }

   public uint16Array(key: string) {
      const value = this.storage[key] as ArrayLike<number>;
      const view = this.data.view;
      let offset = this.data.pointer;
      for (let i = 0; i < value.length; i++, offset += 2) view.setUint16(offset, value[i] as number, true);
      this.data.pointer = offset;
      return this;
   }

   protected override array(key: string, length: number, io: (io: BinaryIOWriter) => void): this {
      const value = this.storage[key] as ArrayLike<object>;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (let i = 0; i < value.length; i++) io(this.arraySub(value[i]!));
      return this;
   }
}

export class SafeBinaryIOWriter extends BinaryIOWriter {
   protected override writeUint8(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 8) throw new RangeError(`Used uint8 for ${value}`);
      return super.writeUint8(value);
   }
   protected override writeUint16(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 16) throw new RangeError(`Used uint16 for ${value}`);
      return super.writeUint16(value);
   }
   protected override writeUint32(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 32) throw new RangeError(`Used uint32 for ${value}`);
      return super.writeUint32(value);
   }
}
