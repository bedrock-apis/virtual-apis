import { ModuleLoader } from '@bedrock-apis/va-image-loader';
import { Context } from '@bedrock-apis/virtual-apis';
import { getModuleVersions } from '../get-module-versions';
import { SingletonLoaderContext } from '../singleton-loader';

// Only add loading images to context and registering plugins that really all
const context = new Context();
await new ModuleLoader(context).loadModules(getModuleVersions());
new SingletonLoaderContext(new Context());
