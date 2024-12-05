import {  TriggerEvent } from "./events.js";
import { Kernel } from "../kernel.js";

export const NATIVE_OBJECTS = Kernel.Construct("WeakSet");

export class BuildOptions{
    constructor(className, hasConstructor = false){
        this.className = className;
        this.hasConstructor = hasConstructor;
    }
}