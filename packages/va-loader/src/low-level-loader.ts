// This code has to be redone, but other higher-level loaders doesn't not rely on it
/*
export class CreateSecureValidator {
   protected static readonly resolutionTree = new Map<string, CreateResolverContext>();

   public readonly filesLoaded = new Set();
   public readonly exportsURLStore = new Map<string, string>();
   public constructor(
      public readonly entryPointURL: string,
      public readonly context: Context,
   ) {
      CreateResolverContext.resolutionTree.set(entryPointURL, this);
   }
   public addFileURL(url: string) {
      this.filesLoaded.add(url);
      CreateResolverContext.resolutionTree.set(url, this);
   }
   public resolve(specifier: string, _: Module.ResolveHookContext): Module.ResolveFnOutput {
      const isNative = specifier.startsWith('@minecraft/');
      if (!isNative) {
         const url = new URL(specifier.startsWith('.') ? specifier : `/${specifier}`, _.parentURL).href;

         this.addFileURL(url);
         return {
            url: url,
            shortCircuit: true,
         };
      }
      const symbol = this.context.moduleSymbols.get(specifier);
      if (!symbol) throw new ReferenceError('Importing this module is not loaded, specifier: ' + specifier);

      let url = this.exportsURLStore.get(specifier);
      if (!url) {
         url = this.createModuleURLFromExports(symbol.getRuntimeValue(this.context), specifier);
      }
      return {
         url,
         shortCircuit: true,
      };
   }
   public createModuleURLFromExports(object: object, specifier: string): string {
      const url = createCodeURL(object, specifier, this.context.runtimeId);
      this.exportsURLStore.set(specifier, url);
      return url;
   }
}
*/
