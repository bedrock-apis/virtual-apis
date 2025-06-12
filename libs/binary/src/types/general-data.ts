import { GeneralMetatada } from './metadata';

export interface ImageGeneralHeaderData {
   readonly stringSlices: string[];
   readonly metadata: GeneralMetatada; //For now NBT value
   readonly version: number;
}
