import { Range } from '@bedrock-apis/types';

export interface ImageModule {
   // Metadata
   readonly uuid: string;
   readonly name: string;
   readonly version: string;

   // Module Data
   readonly strings: ArrayLike<string>;
   readonly types: ArrayLike<ImageType>;
   readonly symbols: ArrayLike<ImageSymbol>;
   readonly exports: ArrayLike<number>; // Index ids of the symbols it self
}
export interface ImageSymbol {
   readonly kind: number;
   readonly indexId?: number;
   readonly symbolNameId?: number;
}
export interface ImageConstantSymbol extends ImageSymbol {
   readonly value?: unknown;
}

export interface ImageType {
   readonly kindId: number;
   readonly range?: Range<number, number>;
   readonly length?: number;
   readonly childId?: number;
   readonly childrenIds?: ArrayLike<number>;
}
