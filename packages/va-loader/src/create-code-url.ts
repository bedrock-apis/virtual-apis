// for some reason in some vitest contexts its undefined huh
const virtualApisURL = (import.meta.resolve as unknown)
   ? import.meta.resolve('@bedrock-apis/virtual-apis')
   : 'resolve is undefined';

const { getOwnPropertyNames } = Object;
export function createCodeURL(
   object: object,
   specifier: string,
   contextRuntimeId: number,
   virtualAPIsName: string = virtualApisURL,
   customCode?: string,
): { url: string; code: string } {
   let code = `import { Context } from ${JSON.stringify(virtualAPIsName)};\n`;
   if (customCode) code += customCode;
   code += `export const {${getOwnPropertyNames(object).join(',')}} = Context.getRuntimeModule(${contextRuntimeId}, ${JSON.stringify(specifier)});\n`;
   const url = `data:application/javascript;utf8,${code}`;
   return { url, code };
}
