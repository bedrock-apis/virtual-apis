import { Kernel, KernelArray, KernelIterator } from '@bedrock-apis/kernel-isolation';

export class IndexedSet<T> extends Kernel.Empty {
   protected readonly map: Map<T, number> = Kernel.Construct('Map') as Map<T, number>;
   public constructor() {
      super();
   }
   public getOrAddIndexFor(v: T): number {
      return this.map.get(v) ?? (this.map.set(v, this.map.size), this.map.size - 1);
   }
   public clear() {
      this.map.clear();
   }
   public toArray(): KernelArray<T> {
      return KernelArray.FromIterator<T>(KernelIterator.FromMapIterator<T>(this.map.keys()));
   }
}
