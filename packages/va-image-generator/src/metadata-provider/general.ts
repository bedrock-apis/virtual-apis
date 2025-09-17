import { MetadataModuleDefinition } from '@bedrock-apis/va-types';

// Strip unused properties for easier testing and better dx
export type StrippedMetadataModuleDefinition = Omit<MetadataModuleDefinition, 'type_aliases' | 'module_type'>;

export interface IMetadataProvider {
   getMetadataModules(): AsyncIterable<StrippedMetadataModuleDefinition>;
   getJSModules(): AsyncIterable<[string, string]>;
}
