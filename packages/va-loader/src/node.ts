import { type Context } from '@bedrock-apis/virtual-apis';
import type Module from 'node:module';
import { registerHooks } from 'node:module';

const { getOwnPropertyNames } = Object;
export class CreateResolverContext {
   protected static readonly resolutionTree = new Map<string, CreateResolverContext>();
   static {
      registerHooks({
         resolve: (specifier, context, nextResolve) => {
            const resolverContext = this.resolutionTree.get(context.parentURL!);
            if (!resolverContext) return nextResolve(specifier, context);
            return resolverContext.resolve(specifier, context);
         },
      });
   }

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
      const code = `
      import {Context} from "@bedrock-apis/virtual-apis";
      export const {${getOwnPropertyNames(object).join(',')}} = Context.getRuntimeModule(${this.context.runtimeId}, ${JSON.stringify(specifier)});`;
      const url = `data:application/javascript;utf8,${code}`;
      this.exportsURLStore.set(specifier, url);
      return url;
   }
}
