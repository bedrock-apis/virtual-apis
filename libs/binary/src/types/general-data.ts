import { GeneralMetadata } from './metadata';

export interface ImageGeneralHeaderData {
   readonly stringSlices: readonly string[];
   readonly metadata: GeneralMetadata; //For now NBT value
   readonly version: number;
}
