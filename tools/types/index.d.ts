declare global {
   declare type Relative<T> = `./${T}`;
   declare type Mutable<T> = {
      -readonly [P in keyof T]: T[P];
   };
}
export {};
