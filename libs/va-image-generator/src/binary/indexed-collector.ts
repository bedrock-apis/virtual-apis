import { isDeepStrictEqual } from 'node:util';

export class IndexedCollector<T> {
   protected readonly MAP = new Map<T, number>();
   protected readonly LIST: T[] = [];

   public toIndex(key: T): number {
      let value = this.get(key);
      if (value === null) {
         this.MAP.set(key, (value = this.getIndexFor(key)));
         this.LIST.push(key);
      }
      return value;
   }

   public fromIndex(index: number): T | null {
      return this.LIST[index] ?? null;
   }

   protected getIndexFor(key: T) {
      return this.LIST.length;
   }

   protected get(key: T): number | null {
      return this.MAP.get(key) ?? null;
   }

   public getArray(): T[] {
      return this.LIST;
   }

   public clear() {
      this.MAP.clear();
      this.LIST.length = 0;
   }
}

export class IndexedObjectCollector<T extends { name: string }> extends IndexedCollector<T> {
   public constructor(protected keys: IndexedCollector<string>) {
      super();
   }

   public override fromIndex(index: number): T | null {
      for (const [value, i] of this.MAP) {
         if (index === i) return value;
      }
      return null;
   }

   protected override getIndexFor(key: T): number {
      // This is to prevent collissions with the objects that have same name but different params
      // it would use new key in that case and try again

      let name = key.name;

      while (true) {
         const index = this.keys.toIndex(name);
         const object = this.fromIndex(index);
         if (!object || isDeepStrictEqual(object, key)) {
            key.name = name; // update it to have '$' if it was added
            return index;
         }

         console.log('Different type:', index, name, object, key);
         name = '$' + name;
      }
   }

   public override get(key: T): number | null {
      for (const [t, index] of this.MAP) {
         if (isDeepStrictEqual(t, key)) return index;
      }
      return null;
   }
}
