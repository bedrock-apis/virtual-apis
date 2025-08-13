import { TagType } from '@bedrock-apis/nbt-core';
import { TextDecoder } from 'node:util';
import { DataCursorView } from './data-cursor-view';
import { BinaryIO, Filter, MarshalSerializable, MarshalSerializableType, readEncapsulatedDataSymbol } from './io';

const utf8Decoder = new TextDecoder();

// Use LE always
export class BinaryReader {
   public static getCheckPointUint16(_: DataCursorView): DataCursorView {
      const size = BinaryReader.readUint16(_);
      return _.peek(size);
   }
   public static getCheckPointUint32(_: DataCursorView): DataCursorView {
      const size = BinaryReader.readUint16(_);
      _.pointer += size;
      return _.peek(size);
   }
   public static readCheckPointUint16<T>(_: DataCursorView, reader: (_: DataCursorView) => T): T {
      const size = BinaryReader.readUint16(_);
      return reader(_.peek(size));
   }
   public static readCheckPointUint32<T>(_: DataCursorView, reader: (_: DataCursorView) => T): T {
      const size = BinaryReader.readUint32(_);
      return reader(_.peek(size));
   }
   public static readUint8(dataProvider: DataCursorView): number {
      return dataProvider.view.getUint8(dataProvider.pointer++);
   }

   public static readUint16(dataProvider: DataCursorView): number {
      const value = dataProvider.view.getUint16(dataProvider.pointer, true);
      dataProvider.pointer += 2;
      return value;
   }

   // Memory efficient but not as fast, has to be benchamarked on real-world samples
   public static readVarUint32(dataProvider: DataCursorView): number {
      let current = dataProvider.buffer[dataProvider.pointer++] ?? 0;
      let value = current;
      let shift = 0;
      let i = 0;
      while (value & 0x80 && i++ < 5) {
         current = dataProvider.buffer[dataProvider.pointer++] ?? 0;
         value |= (current & 0x7f) << (shift += 7);
      }
      return value;
   }

   public static readUint32(dataProvider: DataCursorView): number {
      const value = dataProvider.view.getUint32(dataProvider.pointer, true);
      dataProvider.pointer += 4;
      return value;
   }
   public static readFloat64(dataProvider: DataCursorView): number {
      const value = dataProvider.view.getFloat64(dataProvider.pointer, true);
      dataProvider.pointer += 8;
      return value;
   }

   public static readBuffer(dataProvider: DataCursorView, length: number): Uint8Array {
      return dataProvider.buffer.subarray(dataProvider.pointer, (dataProvider.pointer += length));
   }

   public static readStringWith(
      lengthReader: (d: DataCursorView) => number,
      decoder = utf8Decoder,
      dataProvider: DataCursorView,
   ): string {
      const length = lengthReader(dataProvider);
      const buffer = BinaryReader.readBuffer(dataProvider, length);
      return decoder.decode(buffer);
   }

   public static readStringU8: (dataProvider: DataCursorView) => string = BinaryReader.readStringWith.bind(
      BinaryReader,
      BinaryReader.readUint8,
      utf8Decoder,
   );
   public static readStringU16: (dataProvider: DataCursorView) => string = BinaryReader.readStringWith.bind(
      BinaryReader,
      BinaryReader.readUint16,
      utf8Decoder,
   );
   public static readStringU32: (dataProvider: DataCursorView) => string = BinaryReader.readStringWith.bind(
      BinaryReader,
      BinaryReader.readUint32,
      utf8Decoder,
   );

   public static readAfrrayBufferU16(dataProvider: DataCursorView): Uint8Array {
      const length = BinaryReader.readUint16(dataProvider);
      return BinaryReader.readBuffer(dataProvider, length);
   }

   public static readArrayBufferU32(dataProvider: DataCursorView): Uint8Array {
      const length = BinaryReader.readUint32(dataProvider);
      return BinaryReader.readBuffer(dataProvider, length);
   }
   public static readUint16Array(_: DataCursorView, length: number): number[] {
      const view = _.view;
      const buffer = [];
      let offset = _.pointer;
      for (let i = 0; i < length; i++, offset += 2) buffer[i] = view.getUint16(offset, true);
      _.pointer += offset;
      return buffer;
   }
}

type ReaderKey = string;

export class BinaryIOReader extends BinaryIO<Record<ReaderKey, unknown>> {
   public override marshal<S extends MarshalSerializable<S>>(
      key: keyof Filter<object & Partial<Record<string, unknown>>, S>,
      type: MarshalSerializableType<S>,
   ): this {
      const v = (this.storage[key] = type.create());
      v.marshal(new BinaryIOReader(this.data, v as Record<ReaderKey, unknown>) as unknown as BinaryIO<S>);
      return this;
   }
   // Get length methods here act as read too

   protected override getLengthUint8 = this.readUint8;
   private readUint8(): number {
      return this.data.view.getUint8(this.data.pointer++);
   }

   public override getLengthUint16 = this.readUint16;
   private readUint16() {
      const value = this.data.view.getUint16(this.data.pointer, true);
      this.data.pointer += 2;
      return value;
   }

   protected override getLengthUint32 = this.readUint32;
   private readUint32() {
      const value = this.data.view.getUint32(this.data.pointer, true);
      this.data.pointer += 4;
      return value;
   }

   public override bool(key: ReaderKey): this {
      this.storage[key] = this.readUint8() === 1;
      return this;
   }

   public override dynamic(key: string): this {
      this.storage[key] = this.nbtFormatReader[this.nbtFormatReader.readType(this.data) as TagType.Byte](this.data);
      return this;
   }

   public override magic(magic: number): this {
      const read = this.readUint32();
      if (read !== magic) throw new TypeError(`Malformed data, magic doesn't match ${read} != ${magic}`);
      return this;
   }

   public override encapsulate16(io: () => void): this {
      const length = this.readUint16();
      const start = this.data.pointer;
      this.data.pointer += length; // skip data for now
      (this.storage as { [readEncapsulatedDataSymbol]: unknown })[readEncapsulatedDataSymbol] = () => {
         const prev = this.data.pointer;
         this.data.pointer = start;
         io();
         this.data.pointer = prev;
         return this.storage;
      };
      return this;
   }

   public uint8(key: ReaderKey) {
      return (this.storage[key] = this.readUint8()), this;
   }

   public uint16(key: ReaderKey) {
      return (this.storage[key] = this.readUint16()), this;
   }

   public uint32(key: ReaderKey) {
      return (this.storage[key] = this.readUint32()), this;
   }

   // Memory efficient but not as fast, has to be benchamarked on real-world samples
   public varuint32(key: string) {
      let current = this.data.buffer[this.data.pointer++] ?? 0;
      let value = current;
      let shift = 0;
      let i = 0;
      while (value & 0x80 && i++ < 5) {
         current = this.data.buffer[this.data.pointer++] ?? 0;
         value |= (current & 0x7f) << (shift += 7);
      }
      this.storage[key] = value;
      return this;
   }

   public float64(key: string) {
      this.storage[key] = this.data.view.getFloat64(this.data.pointer, true);
      this.data.pointer += 8;
      return this;
   }

   protected readBuffer(length: number): Uint8Array {
      return this.data.buffer.subarray(this.data.pointer, (this.data.pointer += length));
   }

   private readString(length: number, decoder = utf8Decoder): unknown {
      return decoder.decode(this.readBuffer(length));
   }

   protected string(key: string, length: number): this {
      return (this.storage[key] = this.readString(length)), this;
   }

   protected uint16Array(key: string, length: number): this {
      const view = this.data.view;
      const buffer = [];
      let offset = this.data.pointer;
      for (let i = 0; i < length; i++, offset += 2) buffer[i] = view.getUint16(offset, true);
      this.data.pointer = offset;
      this.storage[key] = buffer;
      return this;
   }

   protected string8Array(key: string, length: number): this {
      const buffer = [];
      for (let i = 0; i < length; i++) buffer[i] = this.readString(this.readUint8());
      this.storage[key] = buffer;
      return this;
   }

   protected override array(key: string, length: number, io: (io: BinaryIO<object>) => void): this {
      const buffer = [];
      for (let i = 0; i < length; i++) io(this.external((buffer[buffer.length] = {})));
      this.storage[key] = buffer;
      return this;
   }
}
