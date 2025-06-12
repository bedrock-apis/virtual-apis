export function createPackageCode(specifier: string, version: string) {
   return `import { Context } from '@bedrock-apis/virtual-apis';
const moduleContext = await Context.GetOrCompileContext('${specifier}', '${version}')
export const { ...exportNames } = moduleContext.exports`;
}
