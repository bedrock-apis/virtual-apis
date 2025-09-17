import { WithEncapsulatedData } from '../binary/io';
import { IndexId } from './general';
import { ImageHeader } from './image-header';
import { ModuleMetadata } from './metadata';
import { BinarySymbolStruct } from './symbols';

export interface ImageModuleData {
   symbols: BinarySymbolStruct[];
   exports: IndexId[];
}

export interface SerializableModule extends WithEncapsulatedData {
   metadata: ModuleMetadata;
   data: ImageModuleData;
}

export interface SerializableMetadata {
   version?: number;
   metadata: ImageHeader;
   modules: SerializableModule[];
   jsModules: {
      name: string;
      filename: string;
      code: string;
   }[];
}
