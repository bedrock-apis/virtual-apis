import { IStaticDataProvider } from '../../ref-bapi-nbt/base';

export class StaticDataSource implements IStaticDataProvider {
   public static Alloc(size: number): StaticDataSource {
      return new this(new Uint8Array(size));
   }
   public readonly view: DataView;
   public constructor(
      public readonly uint8Array: Uint8Array,
      public pointer: number = 0,
   ) {
      this.view = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
   }
   public slice(offset: number, length: number): StaticDataSource {
      return new StaticDataSource(this.uint8Array.subarray(this.pointer + offset, this.pointer + offset + length));
   }
   /*
   Similar to slice but incremets pointer to the end of the rented field
   */
   public peek(length: number): StaticDataSource {
      return new StaticDataSource(this.uint8Array.subarray(this.pointer, (this.pointer += length)));
   }
   /*
   Creates new isolated source starting from (this.pointer + offset)
   */
   public rent(offset: number = 0): StaticDataSource {
      return new StaticDataSource(this.uint8Array.subarray(this.pointer + offset));
   }
   public getBuffer(): Uint8Array {
      return this.uint8Array.subarray(0, this.pointer);
   }
}
