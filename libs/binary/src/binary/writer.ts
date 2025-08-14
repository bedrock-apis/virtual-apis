import { TagType } from '@bedrock-apis/nbt-core';
import { TextEncoder } from 'node:util';
import { BinaryIO, Filter, MarshalSerializable, MarshalSerializableType } from './io';

const utf8Encoder = new TextEncoder();

// Use LE always
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
      if (type === 0) return this; // special case
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

   protected get getUint16Setter() {
      return this.data.view.setUint16.bind(this.data.view);
   }

   public uint16Array(key: string) {
      const value = this.storage[key] as ArrayLike<number>;
      const setUint16 = this.getUint16Setter;
      let offset = this.data.pointer;
      for (let i = 0; i < value.length; i++, offset += 2) setUint16(offset, value[i] as number, true);
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
      this.validateUint(value, 8);
      return super.writeUint8(value);
   }
   protected override writeUint16(value: number): number {
      this.validateUint(value, 16);
      return super.writeUint16(value);
   }

   private validateUint(value: number, size: number) {
      if ((value !== 0 && !value) || value < 0 || value > 2 ** size)
         throw new RangeError(`Used uint16 for ${value}, storage ${JSON.stringify(this.storage, null, 2)}`);
   }

   protected override writeUint32(value: number): number {
      this.validateUint(value, 32);
      return super.writeUint32(value);
   }

   protected override get getUint16Setter() {
      const set = super.getUint16Setter;
      return (offset: number, value: number, la: boolean) => {
         this.validateUint(value, 16);
         set(offset, value, la);
      };
   }
}
