import { ImageModuleData, SymbolBitFlags } from '@bedrock-apis/binary';
import { BitFlags } from '@bedrock-apis/common';
import { Kernel, KernelArray, KernelIterator } from '@bedrock-apis/kernel-isolation';
import { MetadataType } from '@bedrock-apis/types';
import { IndexedAccessor } from '../../../../libs/va-image-generator/src/binary/indexed-collector';
import { createPackageCode } from '../../../va-loader/src/create-package-code';
import { Diagnostics } from '../diagnostics';
import { NativeEvent } from '../events';
import { DynamicType, ParamsDefinition, Type, VoidType } from '../type-validators';
import { ArrayType } from '../type-validators/types/array';
import { BooleanType } from '../type-validators/types/boolean';
import { FunctionType, GeneratorType } from '../type-validators/types/function';
import { MapType } from '../type-validators/types/map';
import { BigIntType, NumberType } from '../type-validators/types/number';
import { OptionalType } from '../type-validators/types/optional';
import { PromiseType } from '../type-validators/types/promise';
import { StringType } from '../type-validators/types/string';
import { VariantType } from '../type-validators/types/variant';
import { Context } from './context';
import { BaseExecutionParams } from './symbols/class';
import { FunctionAPISymbol } from './symbols/function';
import { ObjectAPISymbol } from './symbols/object';
import { APISymbol } from './symbols/symbol';

export class ModuleContext extends Kernel.Empty {
   private readonly TYPES = Kernel.Construct('Map') as Map<string, Type>;
   private readonly UNRESOLVED_TYPES = Kernel.Construct('Map') as Map<string, DynamicType>;
   private EXPORTS?: Record<string, unknown>;
   public readonly symbols = Kernel.Construct('Map') as Map<string, APISymbol>;

   public constructor(
      public readonly uuid: string,
      public readonly version: string,
      public readonly specifier: string,
   ) {
      super();
   }

   private exportsList = KernelArray.Construct<string>();

   public loadSymbols(
      // indexed uncollector? idk
      strings: IndexedAccessor<string>,
      types: IndexedAccessor<{ name: number }>,
      { exports, symbols }: ImageModuleData,
   ) {
      const { fromIndex } = strings;

      const resolveType = (index: number) => {
         // @ts-expect-error make resolveType accept serializedtype
         return this.resolveType(types.fromIndex(index));
      };

      // for const type of typesCollector.getList()
      //   if BinaryFlags.allOf(TypeKind.Number)
      //     this.registerType(fromIndex(type.name), new NumberType(type.range))
      //   if BinaryFlags.allOf(TypeKind.String)
      //     this.registerType(fromIndex(type.name), StringType)
      // ...

      for (const symbol of KernelArray.From(symbols).getIterator()) {
         const name = strings.fromIndex(symbol.name);

         if (BitFlags.AllOf(symbol.bitFlags, SymbolBitFlags.IsObject) && symbol.hasType) {
            this.symbols.set(name, new ObjectAPISymbol(this, name, fromIndex(types.fromIndex(symbol.hasType).name)));
         } else if (
            BitFlags.AllOf(symbol.bitFlags, SymbolBitFlags.IsFunction) &&
            symbol.hasType &&
            symbol.invocablePrivileges
         ) {
            const params = new ParamsDefinition();

            this.symbols.set(
               name,
               new FunctionAPISymbol(this, name, params, resolveType(symbol.hasType), symbol.invocablePrivileges),
            );
         }

         // all other symbol types
      }

      this.exportsList = KernelArray.From(exports).map(e => fromIndex(e));
      this.resolveAllDynamicTypes();
   }

   /** Used in {@link createPackageCode} */
   public compileExports() {
      if (this.EXPORTS) return this.EXPORTS;

      this.EXPORTS = {};
      for (const exportedSymbol of this.exportsList.getIterator()) {
         this.EXPORTS[exportedSymbol] = this.symbols.get(exportedSymbol)?.api;
      }
      return this.EXPORTS;
   }

   /** Register new type */
   public registerType(name: string, type: Type) {
      this.TYPES.set(name, type);
   }

   /** Get dynamic type that will resolve once {@link resolveAllDynamicTypes} is called */
   public getDynamicType(name: string) {
      let dynamicType = this.UNRESOLVED_TYPES.get(name);
      if (!dynamicType) {
         this.UNRESOLVED_TYPES.set(name, (dynamicType = new DynamicType()));
      }
      return dynamicType;
   }
   /** Tries to resolve all unresolved types @internal */
   public resolveAllDynamicTypes() {
      for (const typeName of KernelIterator.FromMapIterator(this.UNRESOLVED_TYPES.keys())) {
         const resolvedType = this.TYPES.get(typeName);
         if (!resolvedType) continue;
         // It is available trust me!!!
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         const unresolvedType = this.UNRESOLVED_TYPES.get(typeName)!;
         unresolvedType.setType(resolvedType);
         this.UNRESOLVED_TYPES.delete(typeName);
      }

      for (const typeName of KernelIterator.FromMapIterator(this.UNRESOLVED_TYPES.keys()))
         Kernel.warn('Failed to resolve dynamic type: ' + typeName);
   }

   public readonly nativeHandles = Kernel.Construct('WeakSet');
   public readonly onDiagnosticsReported = new NativeEvent<[diagnostics: Diagnostics]>();
   public onInvocation(eventName: string, callback: (...params: BaseExecutionParams) => void) {
      const symbol = this.symbols.get(eventName);
      if (!symbol) throw new Kernel['ReferenceError::constructor'](`${eventName} is not registered symbol`);
      symbol.interactionHandler = callback;
   }
   public isHandleNative(handle: unknown) {
      return this.nativeHandles.has(handle as object);
   }

   public reportDiagnostics(diagnostics: Diagnostics) {
      this.onDiagnosticsReported.invoke(diagnostics);
   }

   /** @internal */
   public resolveType(metadataType: MetadataType): Type {
      const { name, from_module } = metadataType;

      if (from_module) {
         const module = Context.GetModule(from_module.name, from_module.version);

         // We expect module to be resolved because we resolve module dependencies before we call any resolveType
         if (!module) {
            throw Kernel['ReferenceError::constructor'](
               `resolveType - Tried to resolve type of uncompiled module that was not in dependencies: ${from_module.name}@${from_module.version}: ${name}`,
            );
         }

         return module.resolveType(metadataType);
      }

      if (metadataType.is_bind_type) {
         const type = this.TYPES.get(name);
         if (type) return type;
         const dynamicBindType = this.getDynamicType(metadataType.name);
         if (!dynamicBindType) throw Kernel['ReferenceError::constructor']('resolveType - Unknown bind type: ' + name);
         return dynamicBindType;
      }

      switch (name) {
         case 'uint8':
         case 'int8':
         case 'uint16':
         case 'int16':
         case 'uint32':
         case 'int32':
         case 'float':
         case 'double':
            return new NumberType(metadataType.valid_range);
         case 'uint64':
         case 'int64':
            return new BigIntType(metadataType.valid_range as unknown as { min: bigint; max: bigint });
         case 'boolean':
            // TODO: Optimize -> no need for new instance when checking boolean
            return new BooleanType();
         case 'string':
            return new StringType();
         case 'closure':
            return new FunctionType();
         case 'variant':
            return new VariantType(metadataType.variant_types.map(e => this.resolveType(e)));
         case 'optional':
            return new OptionalType(this.resolveType(metadataType.optional_type));
         case 'undefined':
            return new VoidType();
         case 'array':
            return new ArrayType(this.resolveType(metadataType.element_type));
         case 'map':
            return new MapType(this.resolveType(metadataType.key_type), this.resolveType(metadataType.value_type));
         case 'promise':
            return new PromiseType();
         case 'generator':
            return new GeneratorType();
         case 'this':
         case 'iterator':
         default:
            // TODO: Metadata type
            throw new Kernel['ReferenceError::constructor'](`resolveType - Unknown type: ${name}`);
      }
   }
}
