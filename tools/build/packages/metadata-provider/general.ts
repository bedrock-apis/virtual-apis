import { MetadataModuleDefinition } from '@helper/script-module-metadata';

export interface IMetadataProvider {
   getMetadataModules(): AsyncIterable<MetadataModuleDefinition>;
}
