import { ModuleMetadata } from './metadata';

export interface ImageModuleHeader {
   readonly metadata: ModuleMetadata;
   readonly size?: number;
}
