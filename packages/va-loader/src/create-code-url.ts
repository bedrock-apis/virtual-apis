const virtualApisURL = import.meta.resolve('@bedrock-apis/virtual-apis');

const { getOwnPropertyNames } = Object;
export function createCodeURL(
   object: object,
   specifier: string,
   contextRuntimeId: number,
   virtualAPIsName: string = virtualApisURL,
): string {
   const code = `import {Context} from ${JSON.stringify(virtualAPIsName)};
export const {${getOwnPropertyNames(object).join(',')}} = Context.getRuntimeModule(${contextRuntimeId}, ${JSON.stringify(specifier)});`;
   const url = `data:application/javascript;utf8,${code}`;
   return url;
}

/**
 * Creates module loader code
 *
 * @param specifier - Module id, e.g. @minecraft/server
 * @param version - Module version, e.g. 1.0.0
 * @param virtualApiPath - Resolved path to @bedrock-apis/virtual-apis in url format
 * @param parentUrl - Url of the importer. Can be used to make multiple instances of same module for different scripts
 * @returns - Module cache
 */
/*

export function createPackageCode(specifier: string, version: string, virtualApiPath = virtualApis, parentUrl = '') {
   return `import { BinaryImageLoader } from '${virtualApiPath}';
const moduleSymbol = BinaryImageLoader.getModule('${specifier}', '${version}')
console.log(moduleSymbol)
export const { ...exportNames } = moduleSymbol.getRuntimeValue()

// parentUrl: ${parentUrl}`;
}*/
