import { getFilesRecursive } from '@bedrock-apis/va-common/node';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { parseSync } from 'oxc-parser';

const green = chalk.rgb(103, 175, 82);
const matchPattern = /\.ts/;
const excludePattern = /node_modules|git|legacy-store|dist/;
const todoPattern = /^ *[A-Z]+:/;
for await (const file of getFilesRecursive('.')) {
   if (excludePattern.test(file)) continue;
   if (matchPattern.test(file)) await fileCommentAnchorsExtractor(file);
}

// TODO: TAG Updated constructionId
async function fileCommentAnchorsExtractor(fileName: string): Promise<string[]> {
   const text = await readFile(fileName);
   const ast = parseSync(fileName, text.toString(), { lang: 'ts', sourceType: 'module' });
   const list: string[] = [];
   const comments = ast.comments.filter(e => todoPattern.test(e.value));
   let i = 1;
   for (const comment of comments) {
      if (!todoPattern.test(comment.value)) continue;
      const isLast = i === comments.length;
      list.push(comment.value);
      console.log(
         green(
            ` ${comments.length === 1 ? ' ' : isLast ? '└' : i === 1 ? '┌' : '├'} //`,
            comment.value.replace(/^ */, ''),
         ),
      );
      const [l, o] = getLine(text, comment.start);
      console.log(green(` ${isLast ? ' ' : '│'} `) + chalk.blackBright(` ${'└'} '${fileName}:${l + 1}:${o}'`));
      i++;
   }
   return list;
}
function getLine(buffer: Uint8Array, position: number): [number, number] {
   let line = 0;
   let offset = 0;
   for (let i = 0; i < position && i < buffer.length; i++, offset++) {
      if (buffer[i] === 0x0a) void (line++, (offset = 0));
   }
   return [line, offset];
}
