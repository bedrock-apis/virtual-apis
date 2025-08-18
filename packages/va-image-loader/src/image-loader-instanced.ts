import {
   BinaryDetailsStruct,
   BinaryImageFormat,
   BinaryIO,
   BinarySymbolStruct,
   BinaryTypeStruct,
   ExportType,
   ImageModuleData,
   ModuleMetadata,
   SerializableModule,
   SymbolBitFlags,
   TypeBitFlagsU16,
} from '@bedrock-apis/binary';
import { BitFlags, IndexedAccessor } from '@bedrock-apis/common';
import {
   bigintType,
   booleanType,
   CompilableSymbol,
   ConstantValueSymbol,
   ConstructableSymbol,
   Context,
   EnumerableAPISymbol,
   FunctionSymbol,
   functionType,
   InterfaceSymbol,
   InvocableSymbol,
   ModuleSymbol,
   NumberType,
   ObjectValueSymbol,
   ParamsValidator,
   RuntimeType,
   stringType,
} from '@bedrock-apis/virtual-apis';

import {
   ArrayType,
   generatorObjectType,
   MapType,
   OptionalType,
   promiseType,
   VariantType,
   voidType,
} from '@bedrock-apis/virtual-apis';

interface PreparedModule {
   metadata: Required<ModuleMetadata>;
   read: () => ImageModuleData;
}

export interface PreparedImage {
   stringSlices: IndexedAccessor<string>;
   typeSlices: IndexedAccessor<BinaryTypeStruct>;
   details: IndexedAccessor<BinaryDetailsStruct>;
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
         metadata: { stringSlices, types, details },
         modules,
      } = BinaryImageFormat.read(buffer);
      return {
         stringSlices: new IndexedAccessor(stringSlices),
         typeSlices: new IndexedAccessor(types),
         modules: modules.map(_ => ({
            metadata: _.metadata as Required<ModuleMetadata>,
            read: () => (BinaryIO.readEncapsulatedData(_) as SerializableModule).data,
         })),
         details: new IndexedAccessor(details),
      } satisfies PreparedImage;
   }
   public readonly loadedModuleSymbols: Map<string, ModuleSymbol> = new Map();

   public async loadModules(versions: Map<string, string>, context: Context) {
      console.log('loading modules', versions);
      const str = this.preparedImage.stringSlices.fromIndex;

      const modulesToLoad: PreparedModule[] = [];

      // JUST FOR SAKE OF TEST REMOVE LATER PLEASE
      const commonLast = this.preparedImage.modules
         .filter(e => str(e.metadata.name) === '@minecraft/common')
         .map(e => ({ version: str(e.metadata.version), e }))
         .sort((a, b) => b.version.localeCompare(a.version));
      modulesToLoad.push(commonLast[0]!.e);
      // END

      for (const [name, version] of versions.entries()) {
         const mod = this.preparedImage.modules.find(
            e => str(e.metadata.name) === name && str(e.metadata.version) === version,
         );

         if (!mod) {
            console.warn('not found module', name, version);
            continue;
         }

         modulesToLoad.push(mod);
      }

      for (const mod of modulesToLoad) {
         const symbol = this.getSymbolForPreparedModule(mod);
         console.log('loadModules loaded', symbol.name);
         context.moduleSymbols.set(symbol.name, symbol);
      }
   }
   public getSymbolForPreparedModule(prepared: PreparedModule): ModuleSymbol {
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
      const { anyOf } = BitFlags;

      const base = new ModuleSymbol().setName(stringOf(prepared.metadata.name));
      const dependencies: Record<string, ModuleSymbol> = {};
      ////////////////////////////////
      // Resolve dependencies
      ////////////////////////////////
      //#region Dependencies
      for (const dependency of prepared.metadata.dependencies) {
         const name = stringOf(dependency.name!);
         if (this.loadedModuleSymbols.has(name)) {
            dependencies[name] = this.loadedModuleSymbols.get(name)!;
            continue;
         }
         if (!this.resolver) throw new ReferenceError('Resolver is required for loading images with dependencies');
         const { name: resolvedName, version } = this.resolver.call(null, name, dependency.versions?.map(stringOf));

         const prepared = this.preparedImage.modules.find(
            _ => stringOf(_.metadata.name) === resolvedName && stringOf(_.metadata.version) === version,
         );
         if (!prepared)
            throw new ReferenceError('No such a module is available in current image: ' + resolvedName + '@' + version);

         dependencies[name] = this.getSymbolForPreparedModule(prepared);
      }
      //#endregion Dependencies

      // Load Symbols
      const namedSymbols: Record<string, CompilableSymbol<unknown>> = {};
      const exportedSubMap = new Map<BinarySymbolStruct, CompilableSymbol<unknown>>();
      const { symbols } = prepared.read();

      //Base Symbol Creation
      //#region Exports

      for (const symbol of symbols) {
         //Skip all not module based symbols
         if (!anyOf(symbol.bitFlags, SymbolBitFlags.IsExportedSymbol)) continue;
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
                     e.addEntry(keyName, symbol.isEnumData?.isNumerical ? symbol.isEnumData.values[i] : keyName);
                  });
               }
               break;
            default:
               throw new ReferenceError('Unknown export type: ' + (symbol.bitFlags & SymbolBitFlags.ExportTypeMask));
         }
         s.setName(stringOf(symbol.name));
         namedSymbols[s.name] = s;
         exportedSubMap.set(symbol, s);
         base.symbols.add(s);
         base.publicSymbols.set(s.name, s);
      }
      //#endregion

      const getDetails = this.preparedImage.details.fromIndex;
      //Again but all symbols with type resolution now
      for (const symbol of symbols) {
         const { bitFlags: flags } = symbol;
         const hasType = anyOf(flags, SymbolBitFlags.HasType) ? this.resolveType(symbol.hasType!, namedSymbols) : null;

         let s: CompilableSymbol<unknown> | null = null;
         if (anyOf(flags, SymbolBitFlags.IsExportedSymbol)) s = exportedSubMap.get(symbol)!;
         if (!s)
            named: {
               if (anyOf(symbol.bitFlags, SymbolBitFlags.IsConstructor)) {
                  if (!(hasType instanceof ConstructableSymbol))
                     throw new TypeError("Constructor's binding type has to be constructable symbol");
                  s = hasType.setIsConstructable(true);
                  break named;
               }
               continue;
            }

         switch (symbol.bitFlags & SymbolBitFlags.ExportTypeMask) {
            case ExportType.Error:
            case ExportType.Class:
               if (hasType) {
                  if (!(hasType instanceof ConstructableSymbol))
                     throw new TypeError('Parent class must by constructable symbol only.');

                  (s as ConstructableSymbol).setParent(hasType);
               }
               break;
            case ExportType.Object:
               if (hasType) {
                  if (!(hasType instanceof ConstructableSymbol))
                     throw new TypeError('Parent class must by constructable symbol only.');

                  (s as ObjectValueSymbol).setConstructable(hasType);
               }
               break;
            case ExportType.Interface:
               if (symbol.isInterfaceData)
                  for (let i = 0; i < symbol.isInterfaceData.keys.length; i++) {
                     const keyName = stringOf(symbol.isInterfaceData.keys[i]!);
                     const type = this.resolveType(symbol.isInterfaceData.types[i]!, namedSymbols);
                     (s as InterfaceSymbol).properties.set(keyName, type);
                  }
               break;
         }

         if (symbol.functionArguments) {
            if (hasType) (s as InvocableSymbol<unknown>).setReturnType(hasType);
            const paramValidator = new ParamsValidator(
               symbol.functionArguments.map(_ => this.resolveType(_, namedSymbols)),
            );
            if (symbol.functionArgumentsDetails) {
               const index = symbol.functionArgumentsDetails.findIndex(
                  _ => ('defaultValue' satisfies keyof BinaryDetailsStruct) in getDetails(_),
               );
               paramValidator.setMinimumParamsRequired(index);
            }
            (s as InvocableSymbol<unknown>).setParamsLength(symbol.functionArguments.length).setParams(paramValidator);
         }
      }

      return base;
   }

   public resolveType(number: number, currentExports: Record<string, CompilableSymbol<unknown>>): RuntimeType {
      const { allOf } = BitFlags;
      const type = this.typeAccessor.fromIndex(number);
      const { flags, fromModuleInfo, bindTypeNameId, numberRange, extendedRef, extendedRefs } = type;
      if (allOf(type.flags, TypeBitFlagsU16.IsBindType)) {
         const bindTypeName = this.stringAccessor.fromIndex(bindTypeNameId!);
         let bindType: CompilableSymbol<unknown> | null;
         if (BitFlags.allOf(type.flags, TypeBitFlagsU16.IsExternalBindType)) {
            console.log(type);
            const moduleSymbol = this.loadedModuleSymbols.get(this.stringAccessor.fromIndex(fromModuleInfo!.nameId));
            if (!moduleSymbol)
               throw new ReferenceError(
                  "Failed to create an bind type dependency from external module that doesn't exists or is not loaded: " +
                     this.stringAccessor.fromIndex(fromModuleInfo!.nameId),
               );
            bindType = moduleSymbol.publicSymbols.get(bindTypeName) ?? null;
         } else {
            bindType = currentExports[bindTypeName] ?? null;
         }

         if (!bindType) throw new ReferenceError('Failed to resolve bind type dependency, name of: ' + bindTypeName);

         if (typeof (bindType as unknown as RuntimeType).isValidValue !== 'function')
            throw new TypeError('Symbol with name of ' + bindTypeName + ' can not be considered as type');
         return bindType as unknown as RuntimeType;
      }

      if (allOf(flags, TypeBitFlagsU16.Boolean)) return booleanType;
      if (allOf(flags, TypeBitFlagsU16.String)) return stringType;
      if (allOf(flags, TypeBitFlagsU16.Closure)) return functionType;
      if (allOf(flags, TypeBitFlagsU16.Undefined)) return voidType;
      if (allOf(flags, TypeBitFlagsU16.Generator)) return generatorObjectType;
      if (allOf(flags, TypeBitFlagsU16.Promise)) return promiseType;
      if (allOf(flags, TypeBitFlagsU16.Map)) return new MapType(this.resolveType(extendedRefs![1]!, currentExports));
      if (allOf(flags, TypeBitFlagsU16.Array)) return new ArrayType(this.resolveType(extendedRef!, currentExports));
      if (allOf(flags, TypeBitFlagsU16.Optional))
         return new OptionalType(this.resolveType(extendedRef!, currentExports));
      if (allOf(flags, TypeBitFlagsU16.Variant))
         return new VariantType(extendedRefs?.map(e => this.resolveType(e, currentExports)));

      // TODO - The BigUint should have proper range of only positive values basically right?
      // Not sure check metadata.json info
      if (allOf(flags, TypeBitFlagsU16.BigInt64)) return bigintType;
      if (allOf(flags, TypeBitFlagsU16.BigUint64)) return bigintType;
      if (allOf(flags, TypeBitFlagsU16.IsNumberType)) {
         return numberRange ? new NumberType(numberRange) : NumberType.default;
      }
      if (flags === 0) return voidType;
      throw new ReferenceError(`resolveType - Unknown type: ${flags} ${JSON.stringify(type)}`);
   }
   // For example you can set @minecraft/common, to all all versions of this module
   // you can also specify the version, eg. @minecraft/common@1.0.0-beta for example
   // This properly is required when we resolve the module version
   // For example @/server-net might request Player class from @/server but the version is trailing
   // so we have to check if the version is allowed and throw if not, MC engine also fails
   // if the modules version dependencies doesn't properly matches
   public resolver?: (name: string, versions?: string[]) => { name: string; version: string };
}
