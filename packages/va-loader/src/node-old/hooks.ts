import { getModuleVersions } from '../get-module-versions';

const MODULES = getModuleVersions();

// Receives data from `register`.
export async function initialize() {}

// Take an `import` or `require` specifier and resolve it to a URL.
export async function resolve(
   specifier: string,
   context: {
      // [ 'node', 'import', 'module-sync', 'node-addons' ]
      conditions: string[];
      // {}
      importAttributes: object;
      // 'file:///C:/absolute/path/to/file.js'
      parentURL: string;
   },
   nextResolve: (specifier: string, context: unknown) => unknown,
) {
   const over = MODULES.get(specifier);
   if (over) return nextResolve(over, context);

   return MODULES.get(specifier) ?? nextResolve(specifier, context);
}

/*
// Take a resolved URL and return the source code to be evaluated.
export async function load(url: unknown, context: unknown, nextLoad: (url: unknown, context: unknown) => unknown) {
   console.log("LOAD")
   return nextLoad(url, context);
}
console.log(load.toString());*/
