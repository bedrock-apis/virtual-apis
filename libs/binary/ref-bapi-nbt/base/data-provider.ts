export interface IStaticDataProvider {
   readonly uint8Array: Uint8Array;
   readonly view: DataView;
   pointer: number;
}
export class StaticDataProvider {
   public static alloc(size: number): StaticDataProvider {
      return new this(new DataView(new ArrayBuffer(size)));
   }
   public readonly uint8Array: Uint8Array;
   public constructor(
      public readonly view: DataView,
      public pointer: number = 0,
   ) {
      this.uint8Array = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
   }
}
