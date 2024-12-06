export {Kernel} from "./kernel";
export {ClassDefinition} from "./class-definition";
export {APIBuilder} from "./api-builder";
import { Kernel } from "./kernel";

export const NATIVE_OBJECTS = Kernel.Construct("WeakSet");

export class BuildOptions{
    constructor(className, hasConstructor = false){
        this.className = className;
        this.hasConstructor = hasConstructor;
    }
}