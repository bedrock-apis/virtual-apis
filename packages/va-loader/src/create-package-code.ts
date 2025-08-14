const virtualApis = import.meta.resolve('@bedrock-apis/virtual-apis');

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
const moduleContext = Context.GetModule('${specifier}', '${version}')
export const { ...exportNames } = moduleContext.compileExports()
// parentUrl: ${parentUrl}`;
}
