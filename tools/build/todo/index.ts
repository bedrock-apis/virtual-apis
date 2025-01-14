import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { parseSync } from 'oxc-parser';
import { getFilesRecursive } from 'tools/utils';

const matchPattern = /\.ts/;
const excludePattern = /node_modules|git/;
const todoPattern = /^ *[A-Z]+:/;
const tasks: Promise<string[]>[] = [];
for await (const file of getFilesRecursive('.')) {
   if (excludePattern.test(file)) continue;
   if (matchPattern.test(file)) tasks.push(fileCommentAnchorsExtractor(file));
}
for (const comments of await Promise.all(tasks));

// TODO:TAG Updated constructionId
async function fileCommentAnchorsExtractor(fileName: string): Promise<string[]> {
   const text = await readFile(fileName);
   const ast = parseSync(fileName, text.toString(), { lang: 'ts', sourceType: 'module' });
   const list: string[] = [];
   for (const comment of ast.comments) {
      if (!todoPattern.test(comment.value)) continue;
      list.push(comment.value);
      console.log(chalk.rgb(89, 165, 65)('//', comment.value.replace(/^ */, '')));
   }
   return list;
}
