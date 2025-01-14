import { createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { getDirectoriesRecursive, getFilesRecursive } from "tools/utils";

const time = Date.now();
const ignorePattern = /git|node_modules|dist/;

const folders = (await readdir(".", { withFileTypes: true })).filter(e => e.isDirectory() && !e.name.match(ignorePattern)).map(e => e.name);

const writable = createWriteStream("tools/types/paths.d.ts" satisfies ProjectFilePath);
writable.write(`type F = ${([...await arrayFromAsync(getFilesRecursive(...folders)), ...(await readdir(".", { withFileTypes: true })).filter(e => e.isFile()).map(e => e.name)]).map(e => JSON.stringify(e)).join(" | ")};\n`);
writable.write(`type D = ${([...await arrayFromAsync(getDirectoriesRecursive(...folders)), ...folders]).map(e => JSON.stringify(e)).join(" | ")};\n`);
writable.end(`;
declare global {
    declare type ProjectFilePath = F;
    declare type ProjectDirPath = D;
    declare type ProjectPath = F | D;
}
export {};
`);

async function arrayFromAsync(aGen: AsyncIterable<string>): Promise<string[]> {
    const entries: string[] = [];
    for await (const e of aGen) {
        entries.push(e);
    }
    return entries;
}
console.log(`Generated /paths.d.ts in ${Date.now() - time}ms`);