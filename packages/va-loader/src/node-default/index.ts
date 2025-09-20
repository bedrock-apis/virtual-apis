import { DumpProvider } from '@bedrock-apis/va-bds-dumps/api';
import { d } from '@bedrock-apis/va-common';
import { BinaryImageLoader } from '@bedrock-apis/va-image-generator';
import { modulesProvider } from '@bedrock-apis/va-image-generator/dump/provider';
import { Context } from '@bedrock-apis/virtual-apis';
import { getModuleVersions } from '../get-module-versions';
import { SingletonLoaderContext } from '../singleton-loader';

export async function loadModules(
   context: Context,
   {
      imagesFolder,
      versions = getModuleVersions(),
      providers = [],
   }: { imagesFolder?: string; versions?: ReturnType<typeof getModuleVersions>; providers?: DumpProvider[] },
) {
   const start = Date.now();
   d('[NodeLoader] loading modules...');
   for (const provider of providers) await provider.read(imagesFolder);
   await BinaryImageLoader.loadFrom(await modulesProvider.read(imagesFolder)).loadModules(versions, context);
   context.ready();
   const loader = new SingletonLoaderContext(context);
   d(`[NodLoader] loaded in ${Date.now() - start}ms`);

   return loader;
}
