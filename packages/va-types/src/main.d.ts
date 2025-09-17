import './paths';
export * from './script-module-metadata';
declare global {
   type Mutable<T> = {
      -readonly [P in keyof T]: T[P];
   };
}
