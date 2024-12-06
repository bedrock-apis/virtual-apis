import { Kernel } from "./kernel"

export type Range = {min: number, max: number};
export type NativeKind = "function" | "getter" | "setter" | "constructor";

export const ErrorMessages = {
    NewExpected: ()=>"must be called with new",
    NoConstructor: (id: string)=>"No constructor for native class '" + id + "'.",
    IncorrectNumberOfArguments: (t: Range, length: number)=>`Incorrect number of arguments to function. Expected ${t.min==t.max?t.min:t.min + "-"+t.max}, received ${length}`,
    BoundToPrototype: (kind: NativeKind, id: string)=>`Native ${kind} [${id}] object bound to prototype does not exist.`,
    NoPrivilege: (kind: NativeKind, id: string)=>`Native ${kind} [${id}] does not have required privileges.`
}

export const ErrorConstructors = {
    NewExpected: Kernel.Constructor("TypeError"),
    NoConstructor: Kernel.Constructor("ReferenceError"),
    BoundToPrototype: Kernel.Constructor("ReferenceError"),
    IncorrectNumberOfArguments: Kernel.Constructor("TypeError"),
    NoPrivilege: Kernel.Constructor("ReferenceError"),
}