import { MetadataModuleDefinition } from '@bedrock-apis/types';

export interface IMetadataProvider {
   getMetadataModules(): AsyncIterable<MetadataModuleDefinition>;
}
