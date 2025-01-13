import { readdir, readFile } from "node:fs/promises";

export async function* GetFilesRecursive(...base: string[]): AsyncGenerator<string> {
    for (const b of base) {
        const dir = b + "/";
        for (const e of await readdir(b, { withFileTypes: true })) {
            if (e.isFile()) yield dir + e.name;
            else if (e.isDirectory()) yield* GetFilesRecursive(dir + e.name);
        }
    }
}
export async function* GetDirectoriesRecursive(...base: string[]): AsyncGenerator<string> {
    for (const b of base) {
        const dir = b + "/";
        for (const e of await readdir(b, { withFileTypes: true })) {
            if (e.isDirectory()) {
                const name = dir + e.name;
                yield* GetFilesRecursive(name);
            }
        }
    }
}
export async function ReadJson<T>(file: $PROJECT_FILE_PATH): Promise<T | null> {
    try {
        return JSON.parse((await readFile(file)).toString()) as T;
    } catch {
        return null;
    }
}