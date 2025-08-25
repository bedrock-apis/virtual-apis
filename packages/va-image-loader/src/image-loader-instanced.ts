import {
   BinaryDetailsStruct,
   BinaryImageFormat,
   BinaryIO,
   BinarySymbolStruct,
   BinaryTypeStruct,
   bitMaskExactMatchForSpecificSymbolFlagsOnlyInternalUseBecauseWhyNot,
   ExportType,
   ImageModuleData,
   ModuleMetadata,
   SerializableModule,
   SpecificSymbolFlags,
   SymbolBitFlags,
   TypeBitFlagsU16,
} from '@bedrock-apis/binary';
import { BitFlags, d, IndexedAccessor } from '@bedrock-apis/common';
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
   MethodSymbol,
   ModuleSymbol,
   NumberType,
   ObjectValueSymbol,
   ParamsValidator,
   PropertyGetterSymbol,
   PropertySetterSymbol,
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
      d('loading modules', versions);
      const str = this.preparedImage.stringSlices.fromIndex;

      const modulesToLoad: PreparedModule[] = [];

      // JUST FOR SAKE OF TEST REMOVE LATER PLEASE
      const commonLast = this.preparedImage.modules
         .filter(
            e => str(e.metadata.name) === '@minecraft/common' || str(e.metadata.name) === '@minecraft/server-admin',
         )
         .map(e => ({ version: str(e.metadata.version), e }))
         .sort((a, b) => b.version.localeCompare(a.version));
      modulesToLoad.push(commonLast[0]!.e);

      // END

      // d(
      //    'deps',
      //    this.preparedImage.modules.map(e => ({
      //       name: str(e.metadata.name),
      //       version: str(e.metadata.version),
      //       deps: e.metadata.dependencies.map(e => [str(e.name ?? 0), ...(e.versions?.map(str) ?? [])]),
      //    })),
      // );

      for (const [name, version] of versions.entries()) {
         const mod = this.preparedImage.modules.find(
            e => str(e.metadata.name) === name && str(e.metadata.version) === version,
         );

         if (!mod) {
            console.warn('not found module', name, version);
            continue;
         }

         if (name === '@minecraft/server-net') {
            const adminLast = this.preparedImage.modules
               .filter(e => str(e.metadata.name) === '@minecraft/server-admin')
               .map(e => ({ version: str(e.metadata.version), e }))
               .sort((a, b) => b.version.localeCompare(a.version));
            modulesToLoad.push(adminLast[0]!.e);
         }

         modulesToLoad.push(mod);
      }

      for (const mod of modulesToLoad) {
         const symbol = this.getSymbolForPreparedModule(mod);
         d('loadModules loaded', symbol.name);
         context.modules.set(symbol.name, symbol);
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
      const r = this.resolveType.bind(this);
      const { anyOf } = BitFlags;

      const base = new ModuleSymbol().setName(stringOf(prepared.metadata.name));
      const dependencies: Record<string, ModuleSymbol> = {};
      ////////////////////////////////
      // Resolve dependencies
      ////////////////////////////////
      //#region Dependencies
      for (const dependency of prepared.metadata.dependencies) {
         const name = stringOf(dependency.name!);
         d('dep name', name);
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
      const symbolCreationCode = {
         [SpecificSymbolFlags.ExportedError](f, s, l) {
            //IDk for now?
            this[SpecificSymbolFlags.ExportedClass]?.(f, s, l);
         },
         [SpecificSymbolFlags.ExportedClass](flags, symbol, list) {
            const s = exportedSubMap.get(symbol)!;
            list.push(s);
            if (anyOf(flags, SymbolBitFlags.HasType))
               if (symbol.hasType) {
                  const ht = r(symbol.hasType, namedSymbols);
                  if (!(ht instanceof ConstructableSymbol))
                     throw new TypeError('Parent class must by constructable symbol only.');

                  (s as ConstructableSymbol).setParent(ht);
               }
         },
         [SpecificSymbolFlags.ExportedObject](flags, symbol, list) {
            const s = exportedSubMap.get(symbol)!;
            list.push(s);
            if (anyOf(flags, SymbolBitFlags.HasType))
               if (symbol.hasType) {
                  const ht = r(symbol.hasType, namedSymbols);
                  if (!(ht instanceof ConstructableSymbol))
                     throw new TypeError('Parent class must by constructable symbol only.');

                  (s as ObjectValueSymbol).setConstructable(ht);
               }
         },
         [SpecificSymbolFlags.ExportedInterface](flags, symbol, list) {
            const s = exportedSubMap.get(symbol)!;
            list.push(s);
            //TODO - Interface actually also might have parent types like interface theoretical inheritance
            if (symbol.isInterfaceData)
               for (let i = 0; i < symbol.isInterfaceData.keys.length; i++) {
                  const keyName = stringOf(symbol.isInterfaceData.keys[i]!);
                  const type = r(symbol.isInterfaceData.types[i]!, namedSymbols);
                  (s as InterfaceSymbol).properties.set(keyName, type);
               }
         },
         [SpecificSymbolFlags.ExportedConstant](flags, symbol, list) {
            list.push(exportedSubMap.get(symbol)!);
         },
         [SpecificSymbolFlags.ExportedEnum](flags, symbol, list) {
            list.push(exportedSubMap.get(symbol)!);
         },
         [SpecificSymbolFlags.ExportedFunction](flags, symbol, list) {
            const s = exportedSubMap.get(symbol)!;
            list.push(s);
            d('exportedFunction name', stringOf(symbol.name));
            if (!symbol.hasType) throw new ReferenceError('ExportedFunction missing function information');
            applyFunctionInformation(symbol, r(symbol.hasType, namedSymbols), s as InvocableSymbol<unknown>);
         },
         [SpecificSymbolFlags.MethodFunction](flags, symbol, list) {
            const isStatic = BitFlags.allOf(flags, SymbolBitFlags.IsStatic);
            const s = isStatic ? new FunctionSymbol() : new MethodSymbol();
            list.push(s);
            if (symbol.hasType === undefined || symbol.boundTo === undefined)
               throw new ReferenceError('MethodFunction missing function information');
            applyFunctionInformation(symbol, r(symbol.hasType, namedSymbols), s);

            const base = r(symbol.boundTo, namedSymbols) as ConstructableSymbol;

            if (s instanceof MethodSymbol) s.setThisType(base);
            base[isStatic ? 'staticFields' : 'prototypeFields'].add(s);
            s.setIdentifier(`${base.name}::${stringOf(symbol.name)}`);
         },
         [SpecificSymbolFlags.ConstructorInformation](flags, symbol) {
            // No push as this symbol is identical to ExportClass option
            if (symbol.hasType === undefined || symbol.boundTo === undefined)
               throw new ReferenceError('ConstructorInformation missing constructor information');
            const boundToConstructor = r(symbol.boundTo, namedSymbols) as ConstructableSymbol;
            applyFunctionInformation(symbol, r(symbol.hasType, namedSymbols), boundToConstructor);
            boundToConstructor.setIsConstructable(true);
         },
         [SpecificSymbolFlags.BoundConstant](flags, symbol, list) {
            if (symbol.boundTo === undefined) throw new ReferenceError('BoundConstant missing bound type information');
            const boundToConstructor = r(symbol.boundTo, namedSymbols) as ConstructableSymbol;
            const isStatic = BitFlags.allOf(flags, SymbolBitFlags.IsStatic);
            const s = new ConstantValueSymbol();
            list.push(s);
            s.setValue(symbol.hasValue);
            boundToConstructor[isStatic ? 'staticFields' : 'prototypeFields'].add(s);
         },
         [SpecificSymbolFlags.BoundProperty](flags, symbol, list) {
            const isStatic = BitFlags.allOf(flags, SymbolBitFlags.IsStatic);
            if (symbol.boundTo === undefined || symbol.hasType === undefined)
               throw new ReferenceError('MethodFunction missing function information');

            const base = r(symbol.boundTo, namedSymbols) as ConstructableSymbol;
            const registry = base[isStatic ? 'staticFields' : 'prototypeFields'];
            const selfName = stringOf(symbol.name);

            const getter = new PropertyGetterSymbol();
            list.push(getter);
            if (!isStatic) getter.setThisType(base);
            getter.setParams(new ParamsValidator([r(symbol.hasType, namedSymbols)]));
            getter.setIsRuntimeBaked(BitFlags.anyOf(flags, SymbolBitFlags.IsBakedProperty));
            getter.setIdentifier(`${base.name}::${selfName}`);
            registry.add(getter);

            if (BitFlags.anyOf(flags, SymbolBitFlags.HasSetter)) {
               const setter = new PropertySetterSymbol();
               list.push(setter);
               if (!isStatic) setter.setThisType(base);
               setter.setParams(new ParamsValidator([]));
               setter.setIdentifier(`${base.name}::${selfName}`);
            }
         },
      } satisfies Record<
         number,
         (flags: number, symbol: BinarySymbolStruct, compilableSymbols: CompilableSymbol<unknown>[]) => void
      >;

      //Again but all symbols with type resolution now
      for (const symbol of symbols) {
         const { bitFlags: flags } = symbol;
         const compSymbols: CompilableSymbol<undefined>[] = [];

         const currentExactBit = flags & bitMaskExactMatchForSpecificSymbolFlagsOnlyInternalUseBecauseWhyNot;
         if (!(currentExactBit in symbolCreationCode))
            throw new ReferenceError(
               'No creating code for this bit combination: ' +
                  currentExactBit +
                  ' fullSymbolBits: ' +
                  this.debugInternalSymbolListBitFlags(flags),
            );
         symbolCreationCode[currentExactBit as SpecificSymbolFlags.MethodFunction](flags, symbol, compSymbols);

         // Shared code
         for (const sm of compSymbols) {
            if (!sm.name) sm.setName(stringOf(symbol.name));
         }
      }

      function applyFunctionInformation(
         symbol: BinarySymbolStruct,
         returnType: RuntimeType,
         runtime: InvocableSymbol<unknown>,
      ) {
         if (returnType) runtime.setReturnType(returnType);

         const paramValidator = new ParamsValidator(symbol.functionArguments!.map(_ => r(_, namedSymbols)));
         if (symbol.functionArgumentsDetails) {
            const index = symbol.functionArgumentsDetails.findIndex(
               _ => ('defaultValue' satisfies keyof BinaryDetailsStruct) in getDetails(_),
            );
            paramValidator.setMinimumParamsRequired(index);
         }
         runtime.setParamsLength(symbol.functionArguments!.length).setParams(paramValidator);
      }
      return base;
   }

   // Type Loading is pretty much done
   public resolveType(number: number, currentExports: Record<string, CompilableSymbol<unknown>>): RuntimeType {
      const { allOf } = BitFlags;
      const type = this.typeAccessor.fromIndex(number);
      const { flags, fromModuleInfo, bindTypeNameId, numberRange, extendedRef, extendedRefs } = type;
      if (allOf(type.flags, TypeBitFlagsU16.IsBindType)) {
         const bindTypeName = this.stringAccessor.fromIndex(bindTypeNameId!);
         let bindType: CompilableSymbol<unknown> | null;
         if (BitFlags.allOf(type.flags, TypeBitFlagsU16.IsExternalBindType)) {
            const moduleSymbol = this.loadedModuleSymbols.get(this.stringAccessor.fromIndex(fromModuleInfo!.nameId));
            if (!moduleSymbol) {
               const from = this.stringAccessor.fromIndex(fromModuleInfo!.nameId);
               throw new ReferenceError(
                  "Failed to create an bind type dependency from external module that doesn't exists or is not loaded: " +
                     bindTypeName +
                     ' from ' +
                     from,
               );
            }
            bindType = moduleSymbol.publicSymbols.get(bindTypeName) ?? null;
         } else {
            bindType = currentExports[bindTypeName] ?? null;
         }

         if (!bindType) throw new ReferenceError('Failed to resolve bind type dependency, name of: ' + bindTypeName);

         if (typeof (bindType as unknown as RuntimeType).isValidValue !== 'function')
            throw new TypeError('Symbol with name of ' + bindTypeName + ' can not be considered as type');
         return bindType as unknown as RuntimeType;
      }
      if (allOf(flags, TypeBitFlagsU16.IsNumberType)) {
         return numberRange ? new NumberType(numberRange) : NumberType.default;
      }

      if (BitFlags.anyOf(type.flags, TypeBitFlagsU16.HasMultiParamsBit | TypeBitFlagsU16.HasSingleParamBit)) {
         if (typeof extendedRef !== 'number' && !extendedRefs)
            throw new Error('Type without extended refs but with their flags ' + JSON.stringify(type, null, 2));
         if (allOf(flags, TypeBitFlagsU16.Generator)) return generatorObjectType;
         if (allOf(flags, TypeBitFlagsU16.Closure)) return functionType;
         if (allOf(flags, TypeBitFlagsU16.Map)) return new MapType(this.resolveType(extendedRefs![1]!, currentExports));
         if (allOf(flags, TypeBitFlagsU16.Variant))
            return new VariantType(extendedRefs?.map(e => this.resolveType(e, currentExports)));

         if (allOf(flags, TypeBitFlagsU16.Promise)) return promiseType;

         if (allOf(flags, TypeBitFlagsU16.Array)) return new ArrayType(this.resolveType(extendedRef!, currentExports));

         if (allOf(flags, TypeBitFlagsU16.Optional))
            return new OptionalType(this.resolveType(extendedRef!, currentExports));
      }

      if (allOf(flags, TypeBitFlagsU16.Boolean)) return booleanType;
      if (allOf(flags, TypeBitFlagsU16.String)) return stringType;
      if (allOf(flags, TypeBitFlagsU16.Undefined)) return voidType;

      // TODO - The BigUint should have proper range of only positive values basically right?
      // Not sure check metadata.json info
      if (allOf(flags, TypeBitFlagsU16.BigInt64)) return bigintType;
      if (allOf(flags, TypeBitFlagsU16.BigUint64)) return bigintType;

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
   private debugInternalSymbolListBitFlags(flags: number): string {
      return Object.keys(SymbolBitFlags)
         .filter(_ => isNaN(Number(_)))
         .map(
            _ => `${_}: ${BitFlags.anyOf(flags, SymbolBitFlags[_ as unknown as SymbolBitFlags] as unknown as number)}`,
         )
         .join('\n');
   }
}
