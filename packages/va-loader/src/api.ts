import { type Context } from '@bedrock-apis/virtual-apis';
import type Module from 'node:module';
import { registerHooks } from 'node:module';
import { createCodeURL } from './create-code-url';

export abstract class BaseResolverContext {
   public constructor(public readonly context: Context) {
      registerHooks({
         resolve: (specifier, context, nextResolve) => {
            if (!this.isConsidered(specifier, context)) return nextResolve(specifier, context);
            return this.resolve(specifier, context);
         },
      });
   }
   protected abstract resolve(specifier: string, context: Module.ResolveHookContext): Module.ResolveFnOutput;
   protected abstract isConsidered(specifier: string, parent: Module.ResolveHookContext): boolean;
   protected readonly cachedCodeURLs = new Map<string, string>();
   protected getNativePackageCodeURL(name: string): string {
      let url = this.cachedCodeURLs.get(name);
      if (!url) {
         this.cachedCodeURLs.set(
            name,
            (url = createCodeURL(this.getPackageRuntimeData(name), name, this.context.getRuntimeId()).url),
         );
      }
      return url;
   }
   protected abstract getPackageRuntimeData(name: string): object;
}
