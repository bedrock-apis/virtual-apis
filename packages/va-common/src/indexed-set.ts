export class IndexedSet<T> {
   protected readonly map: Map<T, number> = new Map<T, number>();
   public getOrAddIndexFor(v: T): number {
      return this.map.get(v) ?? (this.map.set(v, this.map.size), this.map.size - 1);
   }
   public clear() {
      this.map.clear();
   }
   public toArray(): T[] {
      return Array.from(this.map.keys());
   }
}
