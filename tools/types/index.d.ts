declare global {
    declare type Mutable<T> = {
        -readonly [P in keyof T]: T[P];
    };
}
export { };