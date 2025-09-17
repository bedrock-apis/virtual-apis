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
   protected override getNativePackageCodeURL(name: string): string {
      const jsMod = this.context.jsModules.get(name);
      if (jsMod) return `data:application/javascript;utf8,${jsMod}`;

      return super.getNativePackageCodeURL(name);
   }
   protected override getPackageRuntimeData(name: string): object {
      return this.context.onModuleRequested(name).getRuntimeValue(this.context);
   }
}
