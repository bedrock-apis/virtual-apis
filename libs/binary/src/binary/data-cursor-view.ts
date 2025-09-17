import { IDataCursor } from '@bedrock-apis/nbt-core';

export class DataCursorView implements IDataCursor {
   // 4 MB by default
   public static alloc(size = 1 << 22): DataCursorView {
      return new this(new Uint8Array(size));
   }
   public readonly view: DataView;
   public constructor(
      public readonly buffer: Uint8Array,
      public pointer: number = 0,
   ) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
   }
   public getBuffer(): Uint8Array {
      return this.buffer.subarray(0, this.pointer);
   }
}
