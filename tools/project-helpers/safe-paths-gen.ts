import { GetFilesRecursive } from "../utils";

const pattern = /node|bin|dist/;
for await (const file of GetFilesRecursive(".")) {
    if (pattern.test(file)) continue;
    console.log(file);
}