// Critical Field, do not change or remove property names if not necessary

import { IndexId } from './general';

export interface ModuleMetadata {
   name?: IndexId;
   uuid?: IndexId;
   version?: IndexId;
   dependencies: { versions?: IndexId[]; uuid?: IndexId; name?: IndexId }[];
}

// Its serialized via NBT as is
export interface GeneralMetadata {
   engine: number;
}
