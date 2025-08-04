import { MetadataFunctionArgumentDetailsDefinition } from '@bedrock-apis/types';
import { GeneralMetadata } from './metadata';
import { BinaryTypeStruct } from './types';

export interface ImageHeader {
   readonly metadata: GeneralMetadata; //For now NBT value
   readonly stringSlices: string[];
   readonly types: BinaryTypeStruct[];
   // readonly details: NonNullable<MetadataFunctionArgumentDetailsDefinition>[];
}
