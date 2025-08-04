import { IDataCursor } from "@bedrock-apis/nbt-core";

export class DataCursorView implements IDataCursor {
   public static Alloc(size: number): DataCursorView {
      return new this(new Uint8Array(size));
   }
   public readonly view: DataView;
   public constructor(
      public readonly buffer: Uint8Array,
      public pointer: number = 0,
   ) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
   }
   public slice(offset: number, length: number): DataCursorView {
      return new DataCursorView(this.buffer.subarray(this.pointer + offset, this.pointer + offset + length));
   }
   /*
   Similar to slice but increments pointer to the end of the rented field
   */
   public peek(length: number): DataCursorView {
      return new DataCursorView(this.buffer.subarray(this.pointer, (this.pointer += length)));
   }
   /*
   Creates new isolated source starting from (this.pointer + offset)
   */
   public rent(offset: number = 0): DataCursorView {
      return new DataCursorView(this.buffer.subarray(this.pointer + offset));
   }
   public getBuffer(): Uint8Array {
      return this.buffer.subarray(0, this.pointer);
   }
}
