export class BitFlags {
   public static allOf(n: number, flag: number): boolean {
      return (n & flag) === flag;
   }
   public static anyOf(n: number, flags: number): boolean {
      return (n & flags) !== 0;
   }
   public static setBits(n: number, flags: number, value: boolean): number {
      return value ? n | flags : n & ~flags;
   }
}
