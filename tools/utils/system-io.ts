import { readdir, readFile } from "node:fs/promises";

export async function* GetFilesRecursive(base: string): AsyncGenerator<string> {
    const dir = base + "/";
    for (const e of await readdir(base, { withFileTypes: true })) {
        if (e.isFile()) yield dir + e.name;
        else if (e.isDirectory()) yield* GetFilesRecursive(dir + e.name);
    }
}
export async function ReadJson<T>(file: string): Promise<T | null> {
    try {
        return JSON.parse((await readFile(file)).toString()) as T;
    } catch {
        return null;
    }
}