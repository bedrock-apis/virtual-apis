import {
   BinaryImageFormat,
   BinaryIO,
   BinaryTypeStruct,
   ImageModuleData,
   ModuleMetadata,
   SerializableMetadata,
} from '@bedrock-apis/binary';
import { IndexedAccessor } from '@bedrock-apis/common';
import { ModuleSymbol } from '@bedrock-apis/virtual-apis';
import fs from 'node:fs/promises';
import { BinarySymbolLoader } from './symbol-loader';

interface PreparedModule {
   metadata: Required<ModuleMetadata>;
   read: () => ImageModuleData;
}

export interface PreparedImage {
   stringSlice: IndexedAccessor<string>;
   typeSlice: IndexedAccessor<BinaryTypeStruct>;
   modules: PreparedModule[];
}

export class BinaryImageLoader {
   private static async getFromNodeModules(): Promise<Uint8Array<ArrayBufferLike>> {
      try {
         const installed = require.resolve('@bedrock-apis/va-images');
         return new Uint8Array(await fs.readFile(installed));
      } catch (e) {
         if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) {
            throw new Error('Module @bedrock-apis/va-images not found');
         }
         throw e;
      }
   }

   private static cached: PreparedImage | undefined;

   private static async getParsed(): Promise<PreparedImage> {
      return this.parseAndCache(await this.getFromNodeModules());
   }

   private static parseAndCache(image: Uint8Array<ArrayBufferLike>) {
      if (this.cached) return this.cached;

      this.cached = this.prepare(BinaryImageFormat.read(image));
      return this.cached;
   }

   private static prepare(parsed: SerializableMetadata): PreparedImage {
      const stringSlice = new IndexedAccessor(parsed.metadata.stringSlices);
      const typeSlice = new IndexedAccessor(parsed.metadata.types);
      const modules: PreparedImage['modules'] = parsed.modules.map(e => ({
         metadata: e.metadata as Required<ModuleMetadata>,
         read: () => BinaryIO.readEncapsulatedData(e),
      }));

      return { stringSlice, typeSlice, modules };
   }

   private static readonly MODULES = new Map<string, ModuleSymbol>();

   protected static getModuleId(name: string, version: string) {
      return `${name} ${version}`;
   }

   public static getCachedModule(name: string, version: string) {
      return this.MODULES.get(this.getModuleId(name, version));
   }

   public static getModule(name: string, version: string) {
      console.log('getModule', name, version);
      return {
         getRuntimeValue() {
            return {
               Block: 1,
               BlockPermutation: 1,
               Entity: 1,
               ItemStack: 1,
               world: 1,
            };
         },
      };
      // const cached = this.MODULES.get(this.getModuleId(name, version));
      // if (cached) return cached;

      // const image = await this.getParsed();
      // const { stringSlice, modules } = image;
      // const { fromIndex: str } = stringSlice;
      // const imageModule = modules.find(e => str(e.metadata.name) === name && str(e.metadata.version) === version);

      // if (!imageModule) throw new Error(`Unknown module: ${name} ${version}`);

      // return this.loadModule(image, imageModule);
   }

   public static loadModule(image: PreparedImage, imageModule: PreparedModule) {
      const { fromIndex: str } = image.stringSlice;
      const { metadata } = imageModule;
      for (const dep of metadata.dependencies) {
         this.getModule(str(dep.uuid!), str(dep.versions![dep.versions!.length - 1]!));
      }

      const moduleSymbol = new ModuleSymbol();
      moduleSymbol.metadata = { uuid: str(metadata.uuid), version: str(metadata.version), name: str(metadata.name) };
      this.MODULES.set(this.getModuleId(moduleSymbol.metadata.name, moduleSymbol.metadata.version), moduleSymbol);

      BinarySymbolLoader.load(image, imageModule.read(), moduleSymbol);

      return moduleSymbol;
   }

   public static loadModules(image: Uint8Array<ArrayBufferLike>, modules: { version: string; name: string }[]) {
      const parsed = this.parseAndCache(image);
      const { fromIndex: str } = parsed.stringSlice;
      const symbols = [];
      for (const imageModule of parsed.modules) {
         const name = str(imageModule.metadata.name);
         const version = str(imageModule.metadata.version);
         if (!modules.some(m => m.name === name && m.version === version)) continue;

         symbols.push(this.loadModule(parsed, imageModule));
      }

      return symbols;
   }
}
