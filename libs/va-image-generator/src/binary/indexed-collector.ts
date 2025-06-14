export class IndexedCollector<T> {
   protected readonly MAP = new Map<unknown, number>();
   protected readonly LIST: T[] = [];

   public constructor(protected hash?: (key: T) => unknown) {}

   public toIndex(key: T): number {
      const $ = this.hash?.(key) ?? key;
      let value = this.MAP.get($);
      if (value === undefined) {
         this.MAP.set($, (value = this.LIST.length));
         this.LIST.push(key);
      }
      return value;
   }

   public fromIndex(index: number): T {
      const value = this.LIST[index];
      if (typeof value === 'undefined') throw new RangeError(`Index ${index} is out of range 0..${this.LIST.length}`);
      return value;
   }

   public getArray(): T[] {
      return this.LIST;
   }

   public clear() {
      this.MAP.clear();
      this.LIST.length = 0;
   }
}
