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
