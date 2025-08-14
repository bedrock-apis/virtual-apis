import { ResolveFnOutput, ResolveHookContext } from 'module';
import { BaseResolverContext } from './api';

export class SingletonLoaderContext extends BaseResolverContext {
   protected override resolve(specifier: string, context: ResolveHookContext): ResolveFnOutput {
      return {
         url: this.getNativePackageCodeURL(specifier),
         shortCircuit: true,
      };
   }
   protected override isConsidered(specifier: string): boolean {
      // Minecraft modules can be loaded from anywhere
      return specifier.startsWith('@minecraft/');
   }
   protected override getPackageRuntimeData(name: string): object {
      const mod = this.context.moduleSymbols.get(name);
      if (!mod) throw new ReferenceError(`Minecraft module is not available: '${name}'`);
      return mod.getRuntimeValue(this.context);
   }
}
