import { readdir, readFile } from 'node:fs/promises';

export async function* getFilesRecursive(...base: string[]): AsyncGenerator<string> {
   for (const b of base) {
      const dir = b + '/';
      for (const e of await readdir(b, { withFileTypes: true })) {
         if (e.isFile()) yield dir + e.name;
         else if (e.isDirectory()) yield* getFilesRecursive(dir + e.name);
      }
   }
}
export async function* getDirectoriesRecursive(...base: string[]): AsyncGenerator<string> {
   for (const b of base) {
      const dir = b + '/';
      for (const e of await readdir(b, { withFileTypes: true })) {
         if (e.isDirectory()) {
            const name = dir + e.name;
            yield name;
            yield* getDirectoriesRecursive(name);
         }
      }
   }
}
export async function readJson<T>(file: ProjectFilePath): Promise<T | null> {
   try {
      return JSON.parse((await readFile(file)).toString()) as T;
   } catch {
      return null;
   }
}
