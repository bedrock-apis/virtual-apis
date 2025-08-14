import { GeneralMetadata } from './metadata';
import { BinaryTypeStruct } from './types';

// This is not a flag, its type
export enum BinaryDetailsType {
   Empty = 0,
   Range = 1,
   Value = 2,
}

export type BinaryDetailsStruct = {
   type: BinaryDetailsType;
   minValue?: number;
   maxValue?: number;
   defaultValue?: unknown;
};

export interface ImageHeader {
   readonly metadata: GeneralMetadata; //For now NBT value
   readonly stringSlices: string[];
   readonly types: BinaryTypeStruct[];
   readonly details: BinaryDetailsStruct[];
}
