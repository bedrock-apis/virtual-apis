import { Range } from '@bedrock-apis/types';

export interface ImageModuleData {
   readonly types: ArrayLike<ImageType>;
   readonly symbols: ArrayLike<ImageSymbol>;
   readonly exports: Uint16Array | number[]; // Index ids of the symbols it self
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

export function prepareImageModule(imageModule: ImageModule) {
   const { uuid, name, version, strings, types, symbols, exports } = imageModule;

   const preparedTypes = Array.prototype.map.call(
      types,
      ({ kindId, range, length, childId, childrenIds }: ImageType) => ({
         kind: strings[kindId],
         range,
         length,
         childId,
         childrenIds,
      }),
   );

   return { uuid, name, version, types: preparedTypes };
}

export type ImageModulePrepared = ReturnType<typeof prepareImageModule>;
