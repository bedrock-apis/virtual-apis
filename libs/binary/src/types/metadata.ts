// Critical Field, do not change or remove property names if not necessary

import { IndexId } from './general';

export interface ModuleMetadata {
<<<<<<< HEAD
   readonly name?: IndexId;
   readonly uuid?: IndexId;
   readonly version?: IndexId;
   readonly dependencies: { versions?: IndexId[]; uuid?: IndexId; name?: IndexId }[];
=======
   name: IndexId;
   uuid: IndexId;
   version: IndexId;
   dependencies: { name: IndexId; versions: IndexId[]; uuid: IndexId }[];
>>>>>>> 60f1174cc731bbcb733f5b516af68e94e66f174b
}

// Its serialized via NBT as is
export interface GeneralMetadata {
   engine: number;
}
