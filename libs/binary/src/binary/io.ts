import { DataCursorView } from './data-cursor-view';

type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

export abstract class BinaryIO<T extends object> {
   public constructor(
      protected data: DataCursorView,
      public readonly storage: T,
   ) {}

   public sub<K extends keyof PickMatch<T, Record<string, unknown>>>(
      key: K,
   ): K extends keyof T ? (T[K] extends object ? BinaryIO<T[K]> : never) : never {
      // @ts-expect-error yeaah i love breaking ts
      return new (this.constructor as typeof BinaryIO)(this.data, (this.storage[key] ??= {}));
   }

   protected abstract getLengthUint8(key: keyof T): number;
   protected abstract getLengthUint16(key: keyof T): number;
   protected abstract getLengthUint32(key: keyof T): number;

   public abstract uint8(key: keyof PickMatch<T, number>): this;
   public abstract uint16(key: keyof PickMatch<T, number>): this;
   public abstract uint32(key: keyof PickMatch<T, number>): this;
   public abstract varuint32(key: keyof PickMatch<T, number>): this;
   public abstract float64(key: keyof PickMatch<T, number>): this;

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

   public uint16Array8(key: keyof PickMatch<T, number[]>): this {
      return this.uint16Array(key, this.getLengthUint8(key));
   }
   public uint16Array16(key: keyof PickMatch<T, number[]>): this {
      return this.uint16Array(key, this.getLengthUint16(key));
   }
   public uint16Array32(key: keyof PickMatch<T, number[]>): this {
      return this.uint16Array(key, this.getLengthUint32(key));
   }
}
