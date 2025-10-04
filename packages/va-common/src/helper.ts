export function compareVersions(a: string, b: string): number {
   const [aVersion, aTag] = a.split('-');
   const [bVersion, bTag] = b.split('-');

   const aNums = (aVersion ?? '').split('.').map(Number);
   const bNums = (bVersion ?? '').split('.').map(Number);

   for (let i = 0; i < aNums.length || i < bNums.length; i++) {
      const a = aNums[i] ?? 0;
      const b = bNums[i] ?? 0;
      if (a !== b) return a - b;
   }

   // If versions are the same, compare tags
   if (aTag === bTag) return 0;

   // Handle cases where either tag is undefined
   if (!aTag) return -1;
   if (!bTag) return 1;
   return [aTag, bTag].sort()[0] == aTag ? 1 : -1;
}

export class MapWithDefaults<K, V> extends Map<K, V> {
   public getOrCreate(key: K, create: () => V) {
      let value = this.get(key);
      if (typeof value === 'undefined') this.set(key, (value = create()));
      return value;
   }
}

export enum VirtualPrivilege {
   ReadOnly = 'read_only',
   None = 'none',
   EarlyExecution = 'early_execution',
}
