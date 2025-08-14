import { Context } from '@bedrock-apis/virtual-apis';
import { SingletonLoaderContext } from '../singleton-loader';

// Only add loading images to context and registering plugins that really all
new SingletonLoaderContext(new Context());
