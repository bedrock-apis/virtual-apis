export class IndexedCollector<T> {
   private readonly MAP = new Map<T, number>();
   private readonly LIST: T[] = [];

   public getAdd(str: T): number {
      let value = this.MAP.get(str);
      if (value === undefined) {
         this.MAP.set(str, (value = this.LIST.length));
         this.LIST.push(str);
      }
      return value;
   }

   public get(str: T): number | null {
      return this.MAP.get(str) ?? null;
   }
   public getArray(): T[] {
      return this.LIST;
   }
   public clear() {
      this.MAP.clear();
      this.LIST.length = 0;
   }
}
