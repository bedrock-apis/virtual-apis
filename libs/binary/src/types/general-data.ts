import { GeneralMetadata } from './metadata';

export interface ImageGeneralHeaderData {
   readonly stringSlices: string[];
   readonly metadata: GeneralMetadata; //For now NBT value
   readonly version: number;
}
