import {
   BinaryDetailsStruct,
   BinaryDetailsType,
   BinarySymbolStruct,
   BinaryTypeStruct,
   ExportType,
   ImageHeader,
   IndexId,
   SerializableMetadata,
   SerializableModule,
   SymbolBitFlags,
   TypeBitFlagsU16,
} from '@bedrock-apis/binary';
import { BitFlags, IndexedCollector } from '@bedrock-apis/common';
import {
   MetadataClassDefinition,
   MetadataConstantDefinition,
   MetadataEnumDefinition,
   MetadataErrorClassDefinition,
   MetadataFunctionArgumentDefinition,
   MetadataFunctionArgumentDetailsDefinition,
   MetadataFunctionDefinition,
   MetadataInterfaceDefinition,
   MetadataObjectDefinition,
   MetadataType,
   Privilege,
} from '@bedrock-apis/types';
import { IMetadataProvider, StrippedMetadataModuleDefinition } from '../metadata-provider';

export class MetadataToSerializableTransformer {
   protected readonly stringCollector = new IndexedCollector<string>();
   protected readonly stringRef = this.stringCollector.getIndexFor.bind(this.stringCollector);

   protected readonly typesCollector = new IndexedCollector<MetadataType>(JSON.stringify); // fast enough actually
   protected readonly typeRef = this.typesCollector.getIndexFor.bind(this.typesCollector);

   protected readonly detailsCollector = new IndexedCollector<MetadataFunctionArgumentDetailsDefinition>(
      JSON.stringify,
   );
   protected readonly detailsRef = this.detailsCollector.getIndexFor.bind(this.detailsCollector);

   protected readonly createSymbol = SymbolBuilder.createSymbolFactory({
      stringRef: this.stringRef,
      typeRef: this.typeRef,
      detailsRef: this.detailsRef,
   });

   public async transform(metadataProvider: IMetadataProvider): Promise<SerializableMetadata> {
      const stringRef = this.stringRef;
      const modules: SerializableModule[] = [];

      for await (const metadata of metadataProvider.getMetadataModules()) {
         metadata.enums ??= [];

         modules.push({
            metadata: {
               name: stringRef(metadata.name),
               uuid: stringRef(metadata.uuid),
               version: stringRef(metadata.version),
               dependencies: metadata.dependencies.map(e => ({
                  name: stringRef(e.name),
                  uuid: stringRef(e.uuid),
                  versions: e.versions?.map(v => stringRef(v.version)) ?? [],
               })),
            },
            data: {
               symbols: [...this.transformModule(metadata)],
               exports: [
                  ...metadata.enums,
                  ...metadata.classes,
                  ...metadata.errors,
                  ...metadata.functions,
                  ...metadata.objects,
                  ...metadata.constants,
               ].map(c => stringRef(c.name)),
            },
         });
      }

      const metadata: ImageHeader = {
         metadata: { engine: stringRef('1.21.80.0') },
         details: this.detailsCollector.getArrayAndLock().map(e => this.transformDetails(e)),
         types: this.transformTypes(),
         stringSlices: this.stringCollector.getArrayAndLock(),
      };

      return { metadata, modules };
   }

   protected transformDetails(e: MetadataFunctionArgumentDetailsDefinition): BinaryDetailsStruct {
      if (!e) return { type: BinaryDetailsType.Empty };

      return 'max_value' in e
         ? {
              defaultValue: e.default_value,
              maxValue: e.max_value,
              minValue: e.min_value,
              type: BinaryDetailsType.Range,
           }
         : { type: BinaryDetailsType.Value, defaultValue: e.default_value };
   }

   protected *transformModule(metadata: StrippedMetadataModuleDefinition): Generator<BinarySymbolStruct> {
      for (const e of metadata.enums || []) yield this.transformEnum(e).addBits(SymbolBitFlags.IsExportedSymbol);
      for (const e of metadata.interfaces) yield this.transformInterface(e).addBits(SymbolBitFlags.IsExportedSymbol);
      for (const fn of metadata.functions) yield this.transformFunction(fn).addBits(SymbolBitFlags.IsExportedSymbol);
      for (const cl of metadata.classes) yield* this.transformClass(cl);
      for (const e of metadata.objects) yield this.transformObject(e).addBits(SymbolBitFlags.IsExportedSymbol);
      for (const e of metadata.constants) yield this.transformConstant(e).addBits(SymbolBitFlags.IsExportedSymbol);
   }

   protected transformTypes() {
      const typeRef = (t: MetadataType) => {
         const index = this.typesCollector.getIndexFor(t);
         types[index] = this.transformType(t, typeRef);
         return index;
      };

      const types: BinaryTypeStruct[] = [];
      const array = this.typesCollector.getArray();

      // Manually iterate so that we can change array during iteration
      for (let i = 0; i < array.length; i++) {
         types[i] = this.transformType(array[i]!, typeRef);
      }
      this.typesCollector.getArrayAndLock();
      return types;
   }

   protected transformType(e: MetadataType, typeRef: (m: MetadataType) => number): BinaryTypeStruct {
      const type: BinaryTypeStruct = { flags: 0 };

      // Information Bits thats shared for all determination permutations
      if (e.is_errorable) {
         type.flags |= TypeBitFlagsU16.IsErrorable;
         if (e.error_types) {
            type.flags |= TypeBitFlagsU16.HasErrorableExtraData;
            type.errorTypes = e.error_types.map(typeRef);
         }
      }

      // Determination
      if (e.is_bind_type) {
         type.flags |= TypeBitFlagsU16.IsBindType;
         type.bindTypeNameId = this.stringRef(e.name);
         if (e.from_module) {
            type.flags |= TypeBitFlagsU16.IsExternalBit;
            type.fromModuleInfo = {
               nameId: this.stringRef(e.from_module.name),
               version: this.stringRef(e.from_module.version),
            };
         }
         return type;
      }

      {
         // Assign type
         const typeBit = STRING_TYPE_TO_BITS_MAP[e.name] ?? null;
         if (typeBit === null) throw new ReferenceError('Unknown value type: ' + e.name);

         type.flags |= typeBit;
      }

      // Determination if number
      if (BitFlags.allOf(type.flags, TypeBitFlagsU16.IsNumberType)) {
         type.numberRange = { min: e.valid_range.min, max: e.valid_range.max };
         return type;
      }

      if (BitFlags.anyOf(type.flags, TypeBitFlagsU16.HasMultiParamsBit | TypeBitFlagsU16.HasSingleParamBit))
         switch (e.name) {
            // Extended single ref
            case 'optional':
               type.extendedRef = typeRef(e.optional_type);
               break;
            case 'array':
               type.extendedRef = typeRef(e.element_type);
               break;
            case 'promise':
               type.extendedRef = typeRef(e.promise_type);
               break;

            // multiple refs
            case 'variant':
               type.extendedRefs = e.variant_types.map(typeRef);
               break;
            case 'closure':
               type.extendedRefs = [typeRef(e.closure_type.return_type), ...e.closure_type.argument_types.map(typeRef)];
               break;
            case 'generator':
               type.extendedRefs = [
                  // same order as ts type params for Generator
                  typeRef(e.generator_type.yield_type),
                  typeRef(e.generator_type.return_type),
                  typeRef(e.generator_type.next_type),
               ];
               break;
            case 'map':
               type.extendedRefs = [typeRef(e.key_type), typeRef(e.value_type)];
               break;
         }

      return type;
   }

   protected transformFunction(metadata: MetadataFunctionDefinition): SymbolBuilderStruct {
      const symbol = this.createSymbol()
         .setName(metadata.name)
         .setInvocable(metadata.call_privilege)
         .setArguments(metadata.arguments)
         .setTypeFor(metadata.return_type);

      return symbol;
   }

   protected transformEnum(metadata: MetadataEnumDefinition): SymbolBuilderStruct {
      const symbol = this.createSymbol()
         .setName(metadata.name)
         .addBits<SymbolBuilderStruct>(SymbolBitFlags.IsExportedSymbol | ExportType.Enum);

      symbol.isEnumData = {
         isNumerical: Boolean(metadata.constants.some(e => typeof e.value === 'number')),
         keys: metadata.constants.map(e => this.stringRef(e.name)),
         values: metadata.constants.map(e => {
            switch (typeof e.value) {
               case 'string':
                  return this.stringRef(e.value);
               case 'number':
                  return e.value;
               default:
                  throw new Error(`Expected enum value to be string or number, got ${typeof e} - ${e}`);
            }
         }),
      };
      return symbol;
   }

   // mostly its for
   // const world: World and const system: System
   protected transformObject(metadata: MetadataObjectDefinition): SymbolBuilderStruct {
      const symbol = this.createSymbol()
         .addBits(SymbolBitFlags.IsObject)
         .setName(metadata.name)
         .setTypeFor(metadata.type);
      return symbol;
   }

   protected transformConstant(metadata: MetadataConstantDefinition): SymbolBuilderStruct {
      const symbol = this.createSymbol().addBits(ExportType.Constant).setName(metadata.name).setTypeFor(metadata.type);
      if (('value' satisfies keyof MetadataConstantDefinition) in metadata) symbol.setValue(metadata.value);
      return symbol;
   }

   protected *transformClass(metadata: MetadataClassDefinition): Generator<SymbolBuilderStruct> {
      const symbol = this.createSymbol()
         .addBits(ExportType.Class | SymbolBitFlags.IsExportedSymbol)
         .setName(metadata.name);
      // TODO Handle symbol.iterator

      // Inherits from
      if (metadata.base_types[0]) symbol.setTypeFor(metadata.base_types[0]);

      // Yield class it self
      yield symbol;

      yield* metadata.functions.map(e => {
         const $ = this.transformFunction(e).setBindType(metadata.type);

         if (e.is_static) $.addBits(SymbolBitFlags.IsStatic);
         if (e.is_constructor) $.addBits(SymbolBitFlags.IsConstructor);

         return $;
      });

      yield* metadata.properties.map(e => {
         const $ = this.createSymbol()
            .setName(e.name)
            .setBindType(metadata.type)
            .setInvocable(e.get_privilege)
            .setTypeFor(e.type);

         if (!e.is_read_only) $.setSetter(e.set_privilege);
         if (e.is_static) $.addBits(SymbolBitFlags.IsStatic);

         return $;
      });

      yield* metadata.constants.map(e => {
         const $ = this.createSymbol().setName(e.name).setBindType(metadata.type).setValue(e.value).setTypeFor(e.type);

         if (!e.is_read_only) $.addBits(SymbolBitFlags.HasSetter);
         if (e.is_static) $.addBits(SymbolBitFlags.IsStatic);

         return $;
      });
   }

   protected transformError(e: MetadataErrorClassDefinition): SymbolBuilderStruct {
      // TODO Complete
      const symbol = this.createSymbol().setName(e.name);
      symbol.addBits(ExportType.Error | SymbolBitFlags.IsExportedSymbol);
      return symbol;
   }

   protected transformInterface(e: MetadataInterfaceDefinition): SymbolBuilderStruct {
      const symbol = this.createSymbol().setName(e.name);
      symbol.addBits<BinarySymbolStruct & SymbolBuilder>(
         ExportType.Interface | SymbolBitFlags.IsExportedSymbol,
      ).isInterfaceData = {
         keys: e.properties.map(e => this.stringRef(e.name)),
         types: e.properties.map(e => this.typeRef(e.type)),
      };

      return symbol;
   }
}

type SymbolBuilderStruct = SymbolBuilder & BinarySymbolStruct;
type ContextSymbolBuilder = {
   readonly stringRef: (_: string) => number;
   readonly typeRef: (_: MetadataType) => number;
   readonly detailsRef: (_: MetadataFunctionArgumentDetailsDefinition) => number;
};

export class SymbolBuilder implements BinarySymbolStruct {
   public static createSymbolFactory(context: ContextSymbolBuilder): () => SymbolBuilder {
      return () => new SymbolBuilder(context);
   }
   public constructor(protected readonly context: ContextSymbolBuilder) {}
   public bitFlags: number = 0;
   public name: IndexId = -1;
   public setName(text: string) {
      this.name = this.context.stringRef(text);
      return this;
   }
   public setIsStatic<T extends SymbolBuilderStruct>(this: T, isStatic: boolean): T {
      if (isStatic) this.bitFlags |= SymbolBitFlags.IsStatic;
      else this.bitFlags &= ~SymbolBitFlags.IsStatic;
      return this;
   }
   public setBindType<T extends SymbolBuilderStruct>(this: T, type: MetadataType): T {
      this.bitFlags |= SymbolBitFlags.IsBound;
      this.boundTo = this.context.typeRef(type);
      return this;
   }
   public setArguments<T extends SymbolBuilderStruct>(this: T, type: MetadataFunctionArgumentDefinition[]): T {
      this.bitFlags |= SymbolBitFlags.IsFunction;
      this.functionArguments = type.map(e => this.context.typeRef(e.type));
      if (type.some(e => !!e.details)) {
         this.bitFlags |= SymbolBitFlags.IsDetailedFunction;
         this.functionArgumentsDetails = type.map(e => this.context.detailsRef(e.details));
      }
      return this;
   }
   public setTypeFor<T extends SymbolBuilderStruct>(this: T, type: MetadataType): T {
      this.bitFlags |= SymbolBitFlags.HasType;
      this.hasType = this.context.typeRef(type);
      return this;
   }
   public setInvocable<T extends SymbolBuilderStruct>(this: T, metadata: Privilege[]): T {
      this.bitFlags |= SymbolBitFlags.IsInvocable;
      this.invocablePrivileges = metadata.map(_ => this.context.stringRef(_.name));
      return this;
   }
   public setSetter<T extends SymbolBuilderStruct>(this: T, metadata: Privilege[]): T {
      this.bitFlags |= SymbolBitFlags.HasSetter;
      this.setterPrivileges = metadata.map(_ => this.context.stringRef(_.name));
      return this;
   }
   public setValue<T extends SymbolBuilderStruct>(this: T, value: unknown): T {
      if (typeof value === 'undefined') return this;

      this.bitFlags |= SymbolBitFlags.IsConstantValue;
      this.hasValue = value;
      return this;
   }
   public addBits<T extends SymbolBuilderStruct>(this: T, bits: number): T {
      this.bitFlags |= bits;
      return this;
   }
   public removeBits<T extends SymbolBuilderStruct>(this: T, bits: number): T {
      this.bitFlags &= ~bits;
      return this;
   }
   public toJSON() {
      const { context, ...json } = this;
      return json;
   }
}

export const STRING_TYPE_TO_BITS_MAP = {
   uint8: TypeBitFlagsU16.Uint8,
   uint16: TypeBitFlagsU16.Uint16,
   uint32: TypeBitFlagsU16.Uint32,
   uint64: TypeBitFlagsU16.BigUint64,
   int8: TypeBitFlagsU16.Int8,
   int16: TypeBitFlagsU16.Int16,
   int32: TypeBitFlagsU16.Int32,
   int64: TypeBitFlagsU16.BigInt64,
   float: TypeBitFlagsU16.Float32,
   double: TypeBitFlagsU16.Float64,

   variant: TypeBitFlagsU16.Variant,
   optional: TypeBitFlagsU16.Optional,
   array: TypeBitFlagsU16.Array,
   closure: TypeBitFlagsU16.Closure,
   promise: TypeBitFlagsU16.Promise,
   generator: TypeBitFlagsU16.Generator,
   map: TypeBitFlagsU16.Map,
   boolean: TypeBitFlagsU16.Boolean,
   string: TypeBitFlagsU16.String,
   undefined: TypeBitFlagsU16.Undefined,
   this: TypeBitFlagsU16.This,
   iterator: TypeBitFlagsU16.Iterator,
   unknown: TypeBitFlagsU16.Unknown,
   Error: TypeBitFlagsU16.Error,
};
