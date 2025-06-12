import { BuildInTypeId } from "./build-in-type-id";

export class BuildInType {
    public constructor(
        public readonly kind: number
    ) {
        if((kind & 0x80))
            throw new TypeError("Not a build in type");

        if(!(kind in BuildInTypeId))
            throw new TypeError("Unknown build-in type specified");
    }
}