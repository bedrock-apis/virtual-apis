// Critical Field, do not change or remove property names if not necessary

import { Short } from '@bedrock-apis/nbt-core';
import { IndexId } from './general';

// Its serialized via NBT as is
export interface ModuleMetadata {
   readonly name?: IndexId;
   readonly uuid?: IndexId;
   readonly version?: IndexId;
   readonly dependencies: { versions?: IndexId[]; uuid?: IndexId; name?: IndexId }[];
}

export interface GeneralMetadata {
   readonly engine?: Short;
}
