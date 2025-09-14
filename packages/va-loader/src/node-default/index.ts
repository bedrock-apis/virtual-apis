import { d } from '@bedrock-apis/common';
import { BinaryImageLoader } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { getModuleVersions, readImageFromNodeModules } from '../get-module-versions';
import { SingletonLoaderContext } from '../singleton-loader';

export async function loadModules(context: Context, versions = getModuleVersions()) {
   const start = Date.now();
   d('[NodeLoader] loading modules...');
   await BinaryImageLoader.loadFromBuffer(await readImageFromNodeModules()).loadModules(versions, context);
   const loader = new SingletonLoaderContext(context);
   d(`[NodLoader] loaded in ${Date.now() - start}ms`);

   return loader;
}
