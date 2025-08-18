import { BinaryLoaderContext } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { getImageFromNodeModules, getModuleVersions } from '../get-module-versions';
import { SingletonLoaderContext } from '../singleton-loader';

// Only add loading images to context and registering plugins that really all
const context = new Context();
await BinaryLoaderContext.create(await getImageFromNodeModules()).loadModules(getModuleVersions(), context);
new SingletonLoaderContext(context);
