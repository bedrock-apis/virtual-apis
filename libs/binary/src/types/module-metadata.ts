// Critical Field, do not change or remove property names if not necessary

import { IndexId } from './general';

// Its serialized via NBT as is
export interface ModuleMetadata {
   readonly name?: IndexId;
   readonly uuif?: IndexId;
   readonly version?: IndexId;
}
