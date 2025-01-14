import { getFilesRecursive } from '../utils';

const pattern = /node|bin|dist/;
for await (const file of getFilesRecursive('.')) {
   if (pattern.test(file)) continue;
   console.log(file);
}
