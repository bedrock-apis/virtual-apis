import { Range } from "@bedrock-apis/types";

export interface ImageModule {
    readonly symbolNames: string[];
    readonly types: ImageType[];
    readonly symbols: ImageSymbol[];
    readonly exports: number[]; // Index id of the symbols it self
}
export interface ImageSymbol {
    readonly kind: number;
    readonly indexId?: number;
    readonly symbolNameId?: number;
}
export interface ImageConstantSymbol extends ImageSymbol {
    readonly value?: any;
}

export interface ImageType {
    readonly kindId: number;
    readonly range?: Range<number, number>;
    readonly length?: number;
    readonly childId?: number;
    readonly childrenIds?: number[];
}