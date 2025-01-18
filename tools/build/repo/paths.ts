import { createWriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { getDirectoriesRecursive, getFilesRecursive } from 'tools/utils';

const time = Date.now();
const pattern = /src|tools/;
const file = 'tools/types/paths.d.ts' satisfies ProjectFilePath;

const folders = (await readdir('.', { withFileTypes: true }))
   .filter(e => e.isDirectory() && e.name.match(pattern))
   .map(e => e.name);

const files = arrayToTypeList(
   ...(await arrayFromAsync(getFilesRecursive(...folders))),
   ...(await readdir('.', { withFileTypes: true })).filter(e => e.isFile()).map(e => e.name),
);

const directories = arrayToTypeList(...(await arrayFromAsync(getDirectoriesRecursive(...folders))), ...folders);

const writable = createWriteStream(file);

writable.write(`/* eslint-ignore */
// prettier-ignore

declare global {
    declare type ProjectFilePath = F;
    declare type ProjectDirPath = D;
    declare type ProjectPath = F | D;
}
export {};
`);

writable.write(`\r\ntype F = ${files};\r\n`);
writable.write(`\r\ntype D = ${directories};\r\n`);
writable.end();

async function arrayFromAsync(aGen: AsyncIterable<string>): Promise<string[]> {
   const entries: string[] = [];
   for await (const e of aGen) entries.push(e);
   return entries;
}

function arrayToTypeList(...array: string[]) {
   return array.map(e => `\r\n   | '${e}'`).join('');
}

console.log(`Generated ${file} in ${Date.now() - time}ms`);
