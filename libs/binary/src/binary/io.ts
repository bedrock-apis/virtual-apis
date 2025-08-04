import { NBT_FORMAT_READER, NBT_FORMAT_WRITER, ReaderLike, WriterLike } from '@bedrock-apis/nbt';
import { DataCursorView } from './data-cursor-view';

export type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

export type PickMatchNoNull<T extends object, Filter> = {
   [K in keyof T as NonNullable<T[K]> extends Filter ? K : never]-?: NonNullable<T[K]>;
};

export abstract class BinaryIO<T extends object> {
   public constructor(
      public readonly data: DataCursorView,
      public readonly storage: T,
   ) {}

   protected readonly nbtFormatReader: ReaderLike = NBT_FORMAT_READER;
   protected readonly nbtFormatWriter: WriterLike = NBT_FORMAT_WRITER;

   public readonly write: boolean = false;

   public sub<K extends keyof PickMatchNoNull<T, Record<string, unknown>>>(
      key: K,
   ): BinaryIO<PickMatchNoNull<T, Record<string, unknown>>[K]> {
      // @ts-expect-error yeaah i love breaking ts
      return this.external((this.storage[key] ??= {}));
   }

   public external<T extends Record<string, unknown>>(data: T): BinaryIO<T> {
      // @ts-expect-error yeaah i love breaking ts
      return new (this.constructor as typeof BinaryIO)(this.data, data);
   }

   public abstract checkPoint16(writer: (_: DataCursorView) => void, reader: (_: DataCursorView) => void): this;
   public abstract checkPoint32(writer: (_: DataCursorView) => void, reader: (_: DataCursorView) => void): this;

   public abstract bool(key: keyof PickMatchNoNull<T, boolean>): this;

   public abstract dynamic(key: keyof T): this;

   public abstract uint8(key: keyof PickMatchNoNull<T, number>): this;
   public abstract uint16(key: keyof PickMatchNoNull<T, number>): this;
   public abstract uint32(key: keyof PickMatchNoNull<T, number>): this;
   public abstract varuint32(key: keyof PickMatch<T, number>): this;
   public abstract float64(key: keyof PickMatchNoNull<T, number>): this;

   public index = this.uint16;

   protected abstract getLengthUint8(key: keyof T): number;
   protected abstract getLengthUint16(key: keyof T): number;
   protected abstract getLengthUint32(key: keyof T): number;

   protected abstract string(key: keyof PickMatch<T, string>, length: number): this;

   public string8(key: keyof PickMatch<T, string>): this {
      return this.string(key, this.getLengthUint8(key));
   }
   public string16(key: keyof PickMatch<T, string>): this {
      return this.string(key, this.getLengthUint16(key));
   }
   public string32(key: keyof PickMatch<T, string>): this {
      return this.string(key, this.getLengthUint32(key));
   }

   protected abstract uint16Array(key: keyof PickMatch<T, number[]>, length: number): this;

   public uint16Array8(key: keyof PickMatchNoNull<T, number[]>): this {
      (this.storage[key] as []) ??= [];
      return this.uint16Array(key, this.getLengthUint8(key));
   }
   public uint16Array16(key: keyof PickMatchNoNull<T, number[]>): this {
      (this.storage[key] as []) ??= [];
      return this.uint16Array(key, this.getLengthUint16(key));
   }
   public uint16Array32(key: keyof PickMatchNoNull<T, number[]>): this {
      (this.storage[key] as []) ??= [];
      return this.uint16Array(key, this.getLengthUint32(key));
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   protected abstract array(key: keyof T, length: number, io: (io: BinaryIO<any>) => void): this;

   public array8<A extends object>(key: keyof PickMatchNoNull<T, A[]>, io: (io: BinaryIO<A>) => void): this {
      (this.storage[key] as []) ??= [];
      return this.array(key, this.getLengthUint8(key), io);
   }
   public array16<A extends object>(key: keyof PickMatchNoNull<T, A[]>, io: (io: BinaryIO<A>) => void): this {
      (this.storage[key] as []) ??= [];
      return this.array(key, this.getLengthUint16(key), io);
   }
   public array32<A extends object>(key: keyof PickMatchNoNull<T, A[]>, io: (io: BinaryIO<A>) => void): this {
      (this.storage[key] as []) ??= [];
      return this.array(key, this.getLengthUint32(key), io);
   }

   protected abstract string8Array(key: keyof PickMatch<T, number[]>, length: number): this;

   public string8Array8(key: keyof PickMatchNoNull<T, string[]>): this {
      (this.storage[key] as []) ??= [];
      return this.string8Array(key, this.getLengthUint8(key));
   }
   public string8Array16(key: keyof PickMatchNoNull<T, string[]>): this {
      (this.storage[key] as []) ??= [];
      return this.string8Array(key, this.getLengthUint16(key));
   }
   public string8Array32(key: keyof PickMatchNoNull<T, string[]>): this {
      (this.storage[key] as []) ??= [];
      return this.string8Array(key, this.getLengthUint32(key));
   }
}
