import { ImageModuleData, ModuleMetadata } from '@bedrock-apis/binary';

export interface SerializableModuleStats {
   uniqueTypes: number;
   classes: number;
   enums: number;
   intefaces: number;
   constants: number;
}

export interface SerializableModule {
   id: string;
   stats: SerializableModuleStats;
   metadata: Required<ModuleMetadata>;
   data: ImageModuleData;
}
