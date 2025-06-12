import { createWriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { getDirectoriesRecursive, getFilesRecursive } from '@bedrock-apis/common';

const time = Date.now();
const pattern = /libs|packages/;
const file = 'libs/types/src/paths.d.ts';

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

`);

writable.write(`\r\nexport type F = ${files};\r\n`);
writable.write(`\r\nexport type D = ${directories};\r\n`);
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
