import { BinaryImageFormat, BinaryIO, BinaryTypeStruct, ImageModuleData, ModuleMetadata } from '@bedrock-apis/binary';
import { IndexedAccessor } from '@bedrock-apis/common';
import { ModuleSymbol } from '@bedrock-apis/virtual-apis';

interface PreparedModule {
   metadata: Required<ModuleMetadata>;
   read: () => ImageModuleData;
}

export interface PreparedImage {
   stringSlices: IndexedAccessor<string>;
   typeSlices: IndexedAccessor<BinaryTypeStruct>;
   modules: PreparedModule[];
}

export class BinaryImageLoader {
   public readonly preparedImage: PreparedImage | null = null;
   public constructor(public readonly buffer: Uint8Array) {}
   public loadHeader(): void {
      const {
         metadata: { stringSlices, types },
         modules,
      } = BinaryImageFormat.read(this.buffer);
      (this as Mutable<this>).preparedImage = {
         stringSlices: new IndexedAccessor(stringSlices),
         typeSlices: new IndexedAccessor(types),
         modules: modules.map(_ => ({
            metadata: _.metadata,
            read: () => BinaryIO.readEncapsulatedData(_),
         })),
      };
   }
}
export class BinaryLoaderContext {
   public readonly moduleSymbols: Map<string, ModuleSymbol> = new Map();
   public loadModule(image: PreparedImage, prepared: PreparedModule) {
      const {
         stringSlices: { fromIndex: stringOf },
         typeSlices: { fromIndex: typeOf },
      } = image;

      // Resolve dependencies
      for (const dependency of prepared.metadata.dependencies) {
         const name = stringOf(dependency.name!);
         if (this.moduleSymbols.has(name)) continue;
         if (!this.resolver) throw new ReferenceError('Resolver is required for loading images with dependencies');
         const { name: resolvedName, version } = this.resolver.call(
            null,
            image,
            name,
            dependency.versions?.map(stringOf),
         );

         const prepared = image.modules.find(
            _ => stringOf(_.metadata.name) === resolvedName && stringOf(_.metadata.version) === version,
         );
         if (!prepared)
            throw new ReferenceError('No such a module is available in current image: ' + resolvedName + '@' + version);

         this.loadModule(image, prepared);
      }

      prepared.read();
   }

   // For example you can set @minecraft/common, to all all versions of this module
   // you can also specify the version, eg. @minecraft/common@1.0.0-beta for example
   // This properly is required when we resolve the module version
   // For example @/server-net might request Player class from @/server but the version is trailing
   // so we have to check if the version is allowed and throw if not, MC engine also fails
   // if the modules version dependencies doesn't properly matches
   public resolver?: (prepared: PreparedImage, name: string, versions?: string[]) => { name: string; version: string };
}
