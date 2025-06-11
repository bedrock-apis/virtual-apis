import { Range } from "@bedrock-apis/types";
import { BuildInTypeId } from "./build-in-type-id";

export interface NumerTypeStructure {
    readonly kind: BuildInTypeId;
    readonly range?: Range<number, number>;
}