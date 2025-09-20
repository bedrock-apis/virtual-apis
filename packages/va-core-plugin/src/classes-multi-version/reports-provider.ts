// TODO Somehow figure out how it would read reporst when bundled

import { corePluginVanillaDataProvider } from './dump/provider';

export const items = corePluginVanillaDataProvider.data?.items;
export const localizationKeys = corePluginVanillaDataProvider.data?.localizationKeys;
export const blocks = corePluginVanillaDataProvider.data?.blocks;
