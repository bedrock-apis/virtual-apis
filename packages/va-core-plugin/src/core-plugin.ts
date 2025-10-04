import { Pluggable, PluginFeature } from '@bedrock-apis/va-pluggable';
import { InvocableSymbol, InvocationInfo, MapWithDefaults, SymbolCallback } from '@bedrock-apis/virtual-apis';
import { TypedDecoratorsFeature } from './decorators';

export class CorePlugin extends Pluggable {
   public static registerDefaultFeature(feature: typeof PluginFeature) {
      this.registerFeature(new feature());
   }

   public override readonly identifier = 'virtual_apis:core_plugin';

   public readonly implementationsWithPriority = new MapWithDefaults<
      InvocableSymbol<unknown>,
      { impl: SymbolCallback; priority: number }[]
   >();

   protected override getImplementations(invocation: InvocationInfo): SymbolCallback[] | undefined {
      return this.implementationsWithPriority.get(invocation.symbol)?.map(e => e.impl);
   }

   public override registerCallback(symbol: InvocableSymbol<unknown>, impl: SymbolCallback, priority = 0): void {
      const implementations = this.implementationsWithPriority.getOrCreate(symbol, () => []);

      implementations.push({ impl, priority });
      implementations.sort((a, b) => b.priority - a.priority);
   }

   public static addNamespace(identifier: string) {
      if (identifier.includes(':')) return identifier;
      return `minecraft:${identifier}`;
   }
}

export const coreDecoratorsFeature = new TypedDecoratorsFeature();
export const va = coreDecoratorsFeature.decorators;
CorePlugin.registerFeature(coreDecoratorsFeature); // TODO Remove later to make user decide
