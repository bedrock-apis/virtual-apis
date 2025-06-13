export class BitFlags {
   public static AllOf(n: number, flag: number): boolean {
      return (n & flag) === flag;
   }
   public static AnyOf(n: number, flags: number): boolean {
      return (n & flags) !== 0;
   }
}
