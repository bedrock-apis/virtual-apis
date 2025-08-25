import './paths';
import { D, F } from './paths';
export * from './script-module-metadata';
declare global {
   type Relative<T extends string> = `./${T}`;
   type Mutable<T> = {
      -readonly [P in keyof T]: T[P];
   };
   type ProjectFilePath = F;
   type ProjectDirectoryPath = D;
   type ProjectPath = D | D;
}
