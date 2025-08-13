import { TagType } from '@bedrock-apis/nbt-core';
import { TextEncoder } from 'node:util';
import { DataCursorView } from './data-cursor-view';
import { BinaryIO, Filter, MarshalSerializable, MarshalSerializableType } from './io';

const utf8Encoder = new TextEncoder();

// Use LE always
export class BinaryWriter {
   public static writeCheckPointUint16(_: DataCursorView, writer: (_: DataCursorView) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.writeUint16(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static writeCheckPointUint32(_: DataCursorView, writer: (_: DataCursorView) => void) {
      const rented = _.rent(2);
      writer(rented);

      BinaryWriter.writeUint32(_, rented.pointer);
      _.pointer += rented.pointer;
   }
   public static writeUint8(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint8(dataProvider.pointer++, value);
   }
   public static writeUint16(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint16(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static writeUint32(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setUint32(dataProvider.pointer, value, true);
      dataProvider.pointer += 2;
   }
   public static writeFloat64(dataProvider: DataCursorView, value: number): void {
      dataProvider.view.setFloat64(dataProvider.pointer, value, true);
      dataProvider.pointer += 8;
   }
   public static writeBuffer(dataProvider: DataCursorView, value: Uint8Array): void {
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static writeStringWith(
      lengthWriter: (d: DataCursorView, v: number) => void,
      encoder = utf8Encoder,
      dataProvider: DataCursorView,
      value: string,
   ) {
      const buffer = encoder.encode(value);
      lengthWriter(dataProvider, buffer.length);
      BinaryWriter.writeBuffer(dataProvider, buffer);
   }
   public static writeStringU8: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint8, utf8Encoder);
   public static writeStringU16: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint16, utf8Encoder);
   public static writeStringU32: (dataProvider: DataCursorView, value: string) => void =
      BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint32, utf8Encoder);
   public static writeArrayBufferU16(dataProvider: DataCursorView, value: Uint8Array): void {
      BinaryWriter.writeUint16(dataProvider, value.length);
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }
   public static writeArrayBufferU32(dataProvider: DataCursorView, value: Uint8Array): void {
      BinaryWriter.writeUint16(dataProvider, value.length);
      dataProvider.buffer.set(value, dataProvider.pointer);
      dataProvider.pointer += value.length;
   }

   public static writeUint16Array(_: DataCursorView, value: ArrayLike<number>): void {
      const view = _.view;
      let offset = _.pointer;
      for (let i = 0; i < value.length; i++, offset += 2) view.setUint16(offset, value[i] as number, true);
      _.pointer = offset;
   }
}

type WriteKey = string;

export class BinaryIOWriter extends BinaryIO<object & Partial<Record<WriteKey, unknown>>> {
   public override marshal<S extends MarshalSerializable<S>>(
      key: keyof Filter<object & Partial<Record<string, unknown>>, S>,
      type: MarshalSerializableType<S>,
   ): this {
      const marshallable = this.storage[key] as S;
      marshallable.marshal(new BinaryIOWriter(this.data, marshallable as object) as unknown as BinaryIO<S>);
      return this;
   }
   public override write = true;

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

   public override magic(magic: number): this {
      return this.writeUint32(magic), this;
   }

   public override encapsulate16(io: () => void): this {
      const start = this.data.pointer;
      this.writeUint16(0); // just so we don't increment pointer by hand
      const dStart = this.data.pointer;
      io();
      const dEnd = this.data.pointer;
      this.data.pointer = start;
      this.writeUint16(dEnd - dStart);
      this.data.pointer = dEnd;
      return this;
   }

   public override dynamic(key: string): this {
      const value = this.storage[key];
      const type = this.nbtFormatWriter.determinateType(value);
      this.nbtFormatWriter.writeType(this.data, type);
      this.nbtFormatWriter[type as TagType.Byte](this.data, value as number);
      return this;
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

   protected string(key: string, _: number) {
      return this.writeString(this.storage[key] as string);
   }

   private writeString(value: string, encoder = utf8Encoder) {
      return this.writeBuffer(encoder.encode(value));
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

   protected override string8Array(key: never): this {
      const value = this.storage[key] as ArrayLike<string>;
      for (let i = 0; i < value.length; i++) {
         this.writeUint8(value[i]!.length);

         this.writeString(value[i]!);
      }
      return this;
   }

   protected override array(key: string, length: number, io: (io: BinaryIO<object>) => void): this {
      const value = this.storage[key] as ArrayLike<object>;

      for (let i = 0; i < value.length; i++) io(this.external(value[i]! as Record<string, unknown>));
      return this;
   }
}

export class SafeBinaryIOWriter extends BinaryIOWriter {
   protected override writeUint8(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 8)
         throw new RangeError(`Used uint8 for ${value}, storage ${JSON.stringify(this.storage, null, 2)}`);
      return super.writeUint8(value);
   }
   protected override writeUint16(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 16)
         throw new RangeError(`Used uint16 for ${value}, storage ${JSON.stringify(this.storage, null, 2)}`);
      return super.writeUint16(value);
   }
   protected override writeUint32(value: number): number {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** 32)
         throw new RangeError(`Used uint32 for ${value}, storage ${JSON.stringify(this.storage, null, 2)}`);
      return super.writeUint32(value);
   }
}
