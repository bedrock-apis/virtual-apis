interface Dependable<T> {
   id: string;
   dependencies: string[];
   value: T;
}

export function resolveDependencies<T>(dependables: Dependable<T>[]): T[] {
   const resolvedDependables = new Set<Dependable<T>>();
   const visitedDependables = new Set<Dependable<T>>();

   function resolve(parents: Dependable<T>[], dependable: Dependable<T>) {
      if (resolvedDependables.has(dependable)) return;
      if (visitedDependables.has(dependable)) {
         throw new Error(
            `Circulal dependency detected! ${parents
               .map(e => e.id)
               .concat(dependable.id)
               .join(' -> ')}`,
         );
      }
      visitedDependables.add(dependable);

      for (const dependency of dependables.filter(e => dependable.dependencies.includes(e.id))) {
         resolve(parents.concat(dependable), dependency);
      }

      resolvedDependables.add(dependable);
   }

   for (const dependable of dependables) {
      resolve([], dependable);
   }

   return Array.from(resolvedDependables).map(e => e.value);
}
