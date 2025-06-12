export function createPackageCode(specifier: string, version: string, virtualApiPath: string) {
   return `import { Context } from '${virtualApiPath}';
const moduleContext = await Context.GetOrCompileContext('${specifier}', '${version}')
export const { ...exportNames } = moduleContext.exports`;
}
