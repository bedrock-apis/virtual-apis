import { MetadataModuleDefinition } from '../../script-module-metadata';

export interface IMetadataProvider {
   getMetadataModules(): AsyncIterable<MetadataModuleDefinition>;
}
