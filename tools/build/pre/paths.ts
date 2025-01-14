import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { GetDirectoriesRecursive, GetFilesRecursive } from "tools/utils";

const time = Date.now();
const ignorePattern = /git|node_modules|dist/;

const folders = (await readdir(".", { withFileTypes: true })).filter(e => e.isDirectory() && !e.name.match(ignorePattern)).map(e => e.name);

const writable = createWriteStream("tools/types/paths.d.ts" satisfies $PROJECT_FILE_PATH);
writable.write(`type F = ${([...await ArrayFromAsync(GetFilesRecursive(...folders)), ...(await readdir(".", { withFileTypes: true })).filter(e => e.isFile()).map(e => e.name)]).map(e => JSON.stringify(e)).join(" | ")};\n`);
writable.write(`type D = ${([...await ArrayFromAsync(GetDirectoriesRecursive(...folders)), ...folders]).map(e => JSON.stringify(e)).join(" | ")};\n`);
writable.end(`;
declare global {
    declare type $PROJECT_FILE_PATH = F;
    declare type $PROJECT_DIR_PATH = D;
    declare type $PROJECT_PATH = F | D;
}
export {};
`);

async function ArrayFromAsync(aGen: AsyncIterable<string>): Promise<string[]> {
    const entries: string[] = [];
    for await (const e of aGen) {
        entries.push(e);
    }
    return entries;
}
console.log(`Generated /paths.d.ts in ${Date.now() - time}ms`);