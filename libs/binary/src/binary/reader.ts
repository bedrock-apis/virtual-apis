import { TagType } from '@bedrock-apis/nbt-core';
import { TextDecoder } from 'node:util';
import { BinaryIO, Filter, MarshalSerializable, MarshalSerializableType, readEncapsulatedDataSymbol } from './io';

const utf8Decoder = new TextDecoder();

// Use LE always
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
      return (this.storage[key] = this.readUint8() !== 0), this;
   }

   public override dynamic(key: string): this {
      const type = this.nbtFormatReader.readType(this.data);
      if (type === 0) return (this.storage[key] = undefined), this; // special case

      this.storage[key] = this.nbtFormatReader[type as TagType.Byte](this.data);
      if (type === TagType.Byte) this.storage[key] = !!this.storage[key]; // nbt reads bool as 1 or 0
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

   // Memory efficient but not as fast, has to be benchmarked on real-world samples
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
