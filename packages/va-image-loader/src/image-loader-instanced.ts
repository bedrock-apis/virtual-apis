import {
   BinaryImageFormat,
   BinaryIO,
   BinaryTypeStruct,
   ExportType,
   ImageModuleData,
   ModuleMetadata,
   SymbolBitFlags,
} from '@bedrock-apis/binary';
import { BitFlags, IndexedAccessor } from '@bedrock-apis/common';
import {
   CompilableSymbol,
   ConstantValueSymbol,
   ConstructableSymbol,
   EnumerableAPISymbol,
   FunctionSymbol,
   InterfaceSymbol,
   ModuleSymbol,
   ObjectValueSymbol,
} from '@bedrock-apis/virtual-apis';

interface PreparedModule {
   metadata: Required<ModuleMetadata>;
   read: () => ImageModuleData;
}

export interface PreparedImage {
   stringSlices: IndexedAccessor<string>;
   typeSlices: IndexedAccessor<BinaryTypeStruct>;
   modules: PreparedModule[];
}

export class BinaryLoaderContext {
   public readonly stringAccessor: IndexedAccessor<string>;
   public readonly typeAccessor: IndexedAccessor<BinaryTypeStruct>;
   protected constructor(public readonly preparedImage: PreparedImage) {
      this.stringAccessor = this.preparedImage.stringSlices;
      this.typeAccessor = this.preparedImage.typeSlices;
   }
   public static create(buffer: Uint8Array): BinaryLoaderContext {
      return new this(this.getPreparedImageFromRaw(buffer));
   }
   public static getPreparedImageFromRaw(buffer: Uint8Array): PreparedImage {
      const {
         metadata: { stringSlices, types },
         modules,
      } = BinaryImageFormat.read(buffer);
      return {
         stringSlices: new IndexedAccessor(stringSlices),
         typeSlices: new IndexedAccessor(types),
         modules: modules.map(_ => ({
            metadata: _.metadata as Required<ModuleMetadata>,
            read: () => BinaryIO.readEncapsulatedData(_),
         })),
      } satisfies PreparedImage;
   }
   public readonly loadedModuleSymbols: Map<string, ModuleSymbol> = new Map();
   public getSymbolForPreparedImage(prepared: PreparedModule): ModuleSymbol {
      const name = this.stringAccessor.fromIndex(prepared.metadata.name);
      let symbol = this.loadedModuleSymbols.get(name);
      if (!symbol) {
         this.loadedModuleSymbols.set(name, (symbol = this.loadModuleInternal(prepared)));
      }
      return symbol;
   }
   protected loadModuleInternal(prepared: PreparedModule): ModuleSymbol {
      const {
         stringAccessor: { fromIndex: stringOf },
      } = this;

      const base = new ModuleSymbol().setName(stringOf(prepared.metadata.name));

      ////////////////////////////////
      // Resolve dependencies
      ////////////////////////////////
      for (const dependency of prepared.metadata.dependencies) {
         const name = stringOf(dependency.name!);
         if (this.loadedModuleSymbols.has(name)) continue;
         if (!this.resolver) throw new ReferenceError('Resolver is required for loading images with dependencies');
         const { name: resolvedName, version } = this.resolver.call(null, name, dependency.versions?.map(stringOf));

         const prepared = this.preparedImage.modules.find(
            _ => stringOf(_.metadata.name) === resolvedName && stringOf(_.metadata.version) === version,
         );
         if (!prepared)
            throw new ReferenceError('No such a module is available in current image: ' + resolvedName + '@' + version);

         this.getSymbolForPreparedImage(prepared);
      }

      // Load Symbols
      const allSymbols: CompilableSymbol<unknown>[] = [];
      const bindTypeMap: Map<string, ConstructableSymbol> = new Map();
      const { symbols } = prepared.read();

      //Base Symbol Creation
      for (const symbol of symbols) {
         //Skip all not module based symbols
         if (!BitFlags.anyOf(symbol.bitFlags, SymbolBitFlags.IsExportedSymbol)) continue;
         let s: CompilableSymbol<unknown>;
         switch (symbol.bitFlags & SymbolBitFlags.ExportTypeMask) {
            case ExportType.Class:
               s = new ConstructableSymbol();
               break;
            case ExportType.Constant:
               s = new ConstantValueSymbol().setValue(symbol.hasValue);
               break;
            case ExportType.Object:
               s = new ObjectValueSymbol();
               break;
            case ExportType.Function:
               s = new FunctionSymbol();
               break;
            case ExportType.Error:
               //TODO - Future Proof
               s = new ConstructableSymbol();
               break;
            case ExportType.Interface:
               s = new InterfaceSymbol();
               break;
            case ExportType.Enum:
               {
                  const e = (s = new EnumerableAPISymbol());
                  symbol.isEnumData?.keys.forEach((_, i) => {
                     const keyName = stringOf(_);
                     e.addEntry(keyName, symbol.isEnumData?.hasNumericalValues ? symbol.isEnumData.values[i] : keyName);
                  });
               }
               break;
            default:
               throw new ReferenceError('Unknown export type: ' + (symbol.bitFlags & SymbolBitFlags.ExportTypeMask));
         }
         s.setName(stringOf(symbol.name));
      }

      //Again but all symbols with resolution
      for (const symbol of symbols) {
         //Skip all not module based symbols
         if (!BitFlags.anyOf(symbol.bitFlags, SymbolBitFlags.IsExportedSymbol)) continue;
         let s: CompilableSymbol<unknown>;
         switch (symbol.bitFlags & SymbolBitFlags.ExportTypeMask) {
            case ExportType.Class:
               s = new ConstructableSymbol();
               break;
            case ExportType.Constant:
               s = new ConstantValueSymbol().setValue(symbol.hasValue);
               break;
            case ExportType.Object:
               s = new ObjectValueSymbol();
               break;
            case ExportType.Function:
               s = new FunctionSymbol();
               break;
            case ExportType.Error:
               //TODO - Future Proof
               s = new ConstructableSymbol();
               break;
            case ExportType.Interface:
               s = new InterfaceSymbol();
               break;
            case ExportType.Enum:
               {
                  const e = (s = new EnumerableAPISymbol());
                  symbol.isEnumData?.keys.forEach((_, i) => {
                     const keyName = stringOf(_);
                     e.addEntry(keyName, symbol.isEnumData?.hasNumericalValues ? symbol.isEnumData.values[i] : keyName);
                  });
               }
               break;
            default:
               throw new ReferenceError('Unknown export type: ' + (symbol.bitFlags & SymbolBitFlags.ExportTypeMask));
         }
         s.setName(stringOf(symbol.name));
      }
      return base;
   }

   // For example you can set @minecraft/common, to all all versions of this module
   // you can also specify the version, eg. @minecraft/common@1.0.0-beta for example
   // This properly is required when we resolve the module version
   // For example @/server-net might request Player class from @/server but the version is trailing
   // so we have to check if the version is allowed and throw if not, MC engine also fails
   // if the modules version dependencies doesn't properly matches
   public resolver?: (name: string, versions?: string[]) => { name: string; version: string };
}
