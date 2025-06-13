import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const virtualApis = pathToFileURL(require.resolve('@bedrock-apis/virtual-apis')).href;

/**
 * Creates module loader code
 *
 * @param specifier - Module id, e.g. @minecraft/server
 * @param version - Module version, e.g. 1.0.0
 * @param virtualApiPath - Resolved path to @bedrock-apis/virtual-apis in url format
 * @param parentUrl - Url of the importer. Can be used to make multiple instances of same module for different scripts
 * @returns - Module cache
 */
export function createPackageCode(specifier: string, version: string, virtualApiPath = virtualApis, parentUrl = '') {
   return `import { Context } from '${virtualApiPath}';
const moduleContext = await Context.GetOrCompileModule('${specifier}', '${version}')
export const { ...exportNames } = moduleContext.exports
// parentUrl: ${parentUrl}`;
}
