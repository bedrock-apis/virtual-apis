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
import fs from 'fs';
import path from 'path';

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

class BehaviorPack {
    static packs: BehaviorPack[] = []

   constructor(private manifestPath: string) {
      this.readAndParseManifest();


   }

   private async readAndParseManifest() {
      interface Manifest {
         modules: { type: 'script' | 'data'; entry?: string }[];
         dependencies?: { module_name: string; version: string }[];
      }
      try {
         const manifest = JSON.parse(await fs.promises.readFile(this.manifestPath, 'utf8')) as Manifest;
         const scriptModule = manifest.modules.find(e => e.type === 'script');
         if (scriptModule?.entry) {
            this.indexJsFullPath = scriptModule.entry;
            if (!manifest.dependencies) throw new Error('No dependencies found in the manifest!');

            for (const dep of manifest.dependencies) {
               if (dep.module_name.startsWith('@minecraft')) this.modules.set(dep.module_name, dep.version);
            }

            BehaviorPack.packs.push(this)
         }
      } catch (e) {
         console.log('Failed to load', this.manifestPath, e);
         
      }
   }

   public indexJsFullPath: string;
   public modules = new Map<string, string>();
}

class VirtualApisPlugin extends Plugin implements PluginEvents {
   public readonly priority: PluginPriority = PluginPriority.Low;

   protected behaviorPacks: BehaviorPack[] = [];

   public constructor() {
      super('va-plugin', '1.0.0');
   }

   public async onInitialize() {
      this.logger.info('Sample plugin initialized!');

      if (fs.existsSync('behavior_packs')) await fs.promises.mkdir('behavior_packs');
      for await (const pack of await fs.promises.readdir('behavior_packs', { withFileTypes: true })) {
         if (!pack.isDirectory()) {
            this.logger.warn('Behavior pack', pack.name, 'is not a directory, skipping...');
            continue;
         }

         const manifestPath = path.join(pack.parentPath, pack.name, 'manifest.json');
         if (fs.existsSync(manifestPath)) new BehaviorPack(manifestPath);
      }
   }

   public onStartUp(): void {
      this.logger.info('Sample plugin started up!');
      const world = World.wrap(this.serenity.getWorld());
      sva.server.constant('world', world);
      // TODO for all beh packs get script module versions
      // create script contexts, load modules binary, parse & compile
      // run scripts
   }

   public onShutDown(): void {
      this.logger.info('Sample plugin shut down!');
   }
}

export default new VirtualApisPlugin();
