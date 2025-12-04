import {
   DecoratedClassesFeature,
   GeneratedModuleTypes,
   ModuleDecorator,
   PluginFeature,
   PrototypeDecorators,
   withGeneratedModules,
} from '@bedrock-apis/va-pluggable';
import { CorePlugin } from './core-plugin';

CorePlugin.registerFeature(DecoratedClassesFeature as typeof PluginFeature);

class CorePluginDecorators extends withGeneratedModules<
   {
      [K in keyof GeneratedModuleTypes]: ModuleDecorator<GeneratedModuleTypes[K]>;
   },
   typeof PrototypeDecorators
>(PrototypeDecorators) {}
export const va = new CorePluginDecorators();
