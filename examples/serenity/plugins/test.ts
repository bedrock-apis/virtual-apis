import { Plugin, PluginEvents, PluginPriority } from '@serenityjs/plugins';
import {
   DecoratedClassesFeature,
   GeneratedModuleTypes,
   ModuleDecorator,
   ModuleTypeMap,
   Pluggable,
   PrototypeDecorators,
   withGeneratedModules,
} from '@bedrock-apis/va-pluggable';
import { Constructable, Prototyped } from '@bedrock-apis/va-pluggable';
import * as s from '@serenityjs/core';

class SerenityPluginVA extends Pluggable {
   public identifier: string = 'serenity';
}

class SerenityModuleDecorators<T extends ModuleTypeMap> extends ModuleDecorator<T> {
   public typeMap = new Map<string, Prototyped>();

   public classMap<
      K extends keyof Constructable<T>,
      P extends Prototyped[],
      Target extends Prototyped & { new (...args: never[]): object },
   >(id: K, target: Target, ...parents: P) {
      type TInstance = InstanceType<Target>;
      class Wrapper {
         constructor(public readonly target: TInstance) {}

         private static wrapCache = new WeakMap<TInstance, object>();

         static wrap<T extends object>(this: new (args: [target: TInstance]) => T, target: TInstance): T {
            const cached = Wrapper.wrapCache.get(target);
            if (cached) return cached as T;

            const res = new this([target]);
            Wrapper.wrapCache.set(target, res);
            return res;
         }
      }
      const proto = super.class(id, ...parents, Wrapper);

      this.typeMap.set(id as string, target);

      // TODO Ensure calls are redirected as expected and that autoconversion from and to storage works

      return proto;
   }
}

class SerenityDecorators extends withGeneratedModules<
   {
      [K in keyof GeneratedModuleTypes]: SerenityModuleDecorators<GeneratedModuleTypes[K]>;
   },
   typeof PrototypeDecorators
>(PrototypeDecorators) {}

const sva = new SerenityDecorators();

SerenityPluginVA.registerFeature(DecoratedClassesFeature);

class World extends sva.server.classMap('World', s.World) {}

class VirtualApisPlugin extends Plugin implements PluginEvents {
   public readonly priority: PluginPriority = PluginPriority.Low;

   public constructor() {
      super('va-plugin', '1.0.0');
   }

   public onInitialize(): void {
      this.logger.info('Sample plugin initialized!');
   }

   public onStartUp(): void {
      this.logger.info('Sample plugin started up!');
      const world = World.wrap(this.serenity.getWorld());
      sva.server.constant('world', world);

      // TODO: Read behavior packs folder
      // read manifest, get versions
      // create script contexts, load modules binary, parse & compile
      // run scripts
   }

   public onShutDown(): void {
      this.logger.info('Sample plugin shut down!');
   }
}

export default new VirtualApisPlugin();
