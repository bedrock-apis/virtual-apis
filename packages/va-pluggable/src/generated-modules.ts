import { ModuleTypeMap, ServerModuleTypeMap } from './types';

export const generatedModules: Record<keyof GeneratedModuleTypes, [id: string, versionFrom?: string]> = {
   server: ['@minecraft/server'],
   server_v1_4: ['@minecraft/server', '1.4.0'],
   server_v2_0: ['@minecraft/server', '2.0.0'],
   server_ui: ['@minecraft/server-ui'],
};

export type GeneratedModuleTypes = {
   server: ServerModuleTypeMap;
   server_v1_4: ServerModuleTypeMap;
   server_v2_0: ServerModuleTypeMap;
   server_ui: ModuleTypeMap;
};
