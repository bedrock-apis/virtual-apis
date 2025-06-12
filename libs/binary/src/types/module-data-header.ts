import { ModuleMetadata } from './module-metadata';

export interface ImageModuleHeader {
   readonly version: number;
   readonly metadata: ModuleMetadata;
   readonly size?: number;
}
