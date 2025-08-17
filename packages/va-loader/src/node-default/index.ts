import { BinaryLoaderContext } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { getModuleVersions } from '../get-module-versions';
import { SingletonLoaderContext } from '../singleton-loader';

// Only add loading images to context and registering plugins that really all
await BinaryLoaderContext.create(await BinaryLoaderContext.getImageFromNodeModules()).loadModules(getModuleVersions());
new SingletonLoaderContext(new Context());
