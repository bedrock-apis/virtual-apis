import {
   BinarySymbolStruct,
   BinaryTypeStruct,
   ImageHeader,
   ImageModuleData,
   IndexId,
   ModuleMetadata,
   SymbolBitFlags,
   TypeBitFlags,
} from '@bedrock-apis/binary';
import { Short } from '@bedrock-apis/nbt-core';
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
import { IndexedCollector } from './indexed-collector';

export interface SerializableModuleStats {
   uniqueTypes: number;
   classes: number;
   enums: number;
   interfaces: number;
   constants: number;
}

export interface SerializableModule {
   id: string;
   stats: SerializableModuleStats;
   metadata: Required<ModuleMetadata>;
   data: ImageModuleData;
}

export interface SerializableMetadata {
   version?: number;
   metadata: ImageHeader;
   modules: SerializableModule[];
}

export class MetadataToSerializableTransformer {
   protected readonly stringCollector = new IndexedCollector<string>();
   protected readonly stringRef = this.stringCollector.getIndexFor.bind(this.stringCollector);

   protected readonly typesCollector = new IndexedCollector<MetadataType>(JSON.stringify); // fast enough actually
   protected readonly typeRef = this.typesCollector.getIndexFor.bind(this.typesCollector);

   protected readonly detailsCollector = new IndexedCollector<NonNullable<MetadataFunctionArgumentDetailsDefinition>>(
      JSON.stringify,
   );
   protected readonly detailsRef = this.detailsCollector.getIndexFor.bind(this.detailsCollector);

   protected readonly createSymbol = SymbolBuilder.CreateSymbolFactory({
      stringRef: this.stringRef,
      typeRef: this.typeRef,
      detailsRef: this.detailsRef,
   });

   public async transform(metadataProvider: IMetadataProvider): Promise<SerializableMetadata> {
      const stringRef = this.stringRef;
      const modules: SerializableModule[] = [];

      for await (const metadata of metadataProvider.getMetadataModules()) {
         metadata.enums ??= [];

         const symbols: BinarySymbolStruct[] = [];

         // stats are used mostly for debugging, so we may remove them later
         const stats: SerializableModuleStats = {
            uniqueTypes: this.typesCollector.getArray().length,
            classes: metadata.classes.length,
            enums: metadata.enums.length,
            interfaces: metadata.interfaces.length,
            constants: metadata.constants.length,
         };

         modules.push({
            id: `${metadata.name} ${metadata.version}`,
            stats,
            metadata: {
               name: stringRef(metadata.name),
               uuid: stringRef(metadata.uuid),
               version: stringRef(metadata.version),
               dependencies: metadata.dependencies.map(e => ({
                  name: stringRef(e.name),
                  uuid: stringRef(e.uuid),
                  versions: e.versions?.map(v => stringRef(v.version)),
               })),
            },
            data: {
               symbols,
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

         symbols.push(...this.transformModule(metadata));

         stats.uniqueTypes = this.typesCollector.getArray().length - stats.uniqueTypes;
      }

      const types = this.transformTypes();

      const metadata: ImageHeader = {
         metadata: { engine: new Short(stringRef('1.21.80.0')) },
         stringSlices: this.stringCollector.getArrayAndLock(),
         // details: this.detailsCollector.getArrayAndLock(),
         types,
      };

      console.log(this.detailsCollector.getArray());

      return { metadata, modules };
   }
   protected *transformModule(metadata: StrippedMetadataModuleDefinition): Generator<BinarySymbolStruct> {
      for (const e of metadata.enums || []) yield this.transformEnum(e);
      for (const e of metadata.interfaces) yield this.transformInterface(e);
      for (const fn of metadata.functions) yield this.transformFunction(fn);
      for (const cl of metadata.classes) yield* this.transformClass(cl);
      for (const e of metadata.objects) yield this.transformObject(e);
      for (const e of metadata.constants) yield this.transformConstant(e);
   }

   protected transformTypes() {
      const typeRef = (t: MetadataType) => {
         const index = IndexedCollector.UnlockedGetIndexFor(this.typesCollector, t);
         const transformed = this.transformType(t, typeRef);
         types.push(transformed);
         return index;
      };
      const types: BinaryTypeStruct[] = [];
      for (const type of this.typesCollector.getArrayAndLock()) {
         types.push(this.transformType(type, typeRef));
      }
      return types;
   }

   protected transformType(e: MetadataType, typeRef: (m: MetadataType) => number): BinaryTypeStruct {
      const type: BinaryTypeStruct = { bitType: 0 };

      if (e.is_errorable) {
         type.bitType |= TypeBitFlags.Errorable;
         if (e.error_types && e.error_types.length) {
            type.bitType |= TypeBitFlags.ErrorableTypes;
            type.errorTypes = e.error_types.map(typeRef);
         }
      }

      // shorter this way
      if (e.name === 'int8') type.bitType |= TypeBitFlags.Int8;
      if (e.name === 'int16') type.bitType |= TypeBitFlags.Int16;
      if (e.name === 'int32') type.bitType |= TypeBitFlags.Int32;
      if (e.name === 'int64') type.bitType |= TypeBitFlags.BigInt64;
      if (e.name === 'uint8') type.bitType |= TypeBitFlags.Uint8;
      if (e.name === 'uint16') type.bitType |= TypeBitFlags.Uint16;
      if (e.name === 'uint32') type.bitType |= TypeBitFlags.Uint32;
      if (e.name === 'uint64') type.bitType |= TypeBitFlags.BigUint64;
      if (e.name === 'float') type.bitType |= TypeBitFlags.Float32;
      if (e.name === 'double') type.bitType |= TypeBitFlags.Float64;

      switch (e.name) {
         case 'int8':
         case 'uint8':
         case 'int16':
         case 'uint16':
         case 'int32':
         case 'uint32':
         case 'int64':
         case 'uint64':
         case 'float':
         case 'double':
            type.numberRange = { min: e.valid_range.min, max: e.valid_range.max };
            break;

         case 'string':
            type.bitType |= TypeBitFlags.String;
            break;
         case 'boolean':
            type.bitType |= TypeBitFlags.Boolean;
            break;
         case 'undefined':
            type.bitType |= TypeBitFlags.Undefined;
            break;

         // Extendned single ref
         case 'optional':
            type.bitType |= TypeBitFlags.Optional;
            type.extendedRef = typeRef(e.optional_type);
            break;
         case 'array':
            type.bitType |= TypeBitFlags.Array;
            type.extendedRef = typeRef(e.element_type);
            break;
         case 'promise':
            type.bitType |= TypeBitFlags.Promise;
            type.extendedRef = typeRef(e.promise_type);
            break;

         // Extended | complex, multiple refs
         case 'variant':
            type.bitType |= TypeBitFlags.Variant;
            type.extendedRefs = e.variant_types.map(typeRef);
            break;
         case 'closure':
            type.bitType |= TypeBitFlags.Closure;
            type.extendedRefs = [typeRef(e.closure_type.return_type), ...e.closure_type.argument_types.map(typeRef)];
            break;
         case 'generator':
            type.bitType |= TypeBitFlags.Generator;
            type.extendedRefs = [
               // same order as ts type params for Generator
               typeRef(e.generator_type.yield_type),
               typeRef(e.generator_type.return_type),
               typeRef(e.generator_type.next_type),
            ];
            break;

         case 'map':
            type.bitType |= TypeBitFlags.Map;
            type.extendedRefs = [typeRef(e.key_type), typeRef(e.value_type)];
            break;
         case 'this':
            type.bitType |= TypeBitFlags.This;
            break;
         case 'iterator':
            type.bitType |= TypeBitFlags.Iterator;
            break;
         case 'unknown':
            type.bitType |= TypeBitFlags.Unknown;
            break;
         default:
            if (e.is_bind_type || e.name === 'Error') {
               type.bitType |= TypeBitFlags.IsBindRef;
               type.bindTypeNameId = this.stringRef(e.name);
               if (e.from_module) {
                  type.bitType |= TypeBitFlags.IsExternal;
                  type.fromModuleInfo = {
                     nameId: this.stringRef(e.from_module.name),
                     version: this.stringRef(e.from_module.version),
                  };
               }
            } else {
               throw new TypeError('Unknown non bindable metadata type name: ' + e.name);
            }
      }

      if (type.bitType === 69 && !type.extendedRef) {
         console.log(type, e);
         throw new Error('A');
      }

      return type;
   }

   protected transformFunction(metadata: MetadataFunctionDefinition): SymbolBuilder & BinarySymbolStruct {
      const symbol = this.createSymbol()
         .setName(metadata.name)
         .setInvocable(metadata.call_privilege)
         .setArguments(metadata.arguments)
         .setTypeFor(metadata.return_type);

      return symbol;
   }

   protected transformEnum(metadata: MetadataEnumDefinition): BinarySymbolStruct {
      const symbol = this.createSymbol()
         .setName(metadata.name)
         .addBits<SymbolBuilder & BinarySymbolStruct>(SymbolBitFlags.IsEnum);

      symbol.isEnumData = {
         hasNumericalValues: metadata.constants.some(e => typeof e.value === 'number'),
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
   protected transformObject(metadata: MetadataObjectDefinition): BinarySymbolStruct {
      const symbol = this.createSymbol()
         .addBits(SymbolBitFlags.IsObject)
         .setName(metadata.name)
         .setTypeFor(metadata.type);
      return symbol;
   }

   protected transformConstant(metadata: MetadataConstantDefinition): BinarySymbolStruct {
      const symbol = this.createSymbol()
         .addBits(SymbolBitFlags.IsConstant)
         .setName(metadata.name)
         .setTypeFor(metadata.type)
         .setValue(metadata.value);
      return symbol;
   }

   protected *transformClass(metadata: MetadataClassDefinition): Generator<BinarySymbolStruct> {
      const symbol = this.createSymbol().addBits(SymbolBitFlags.IsClass).setName(metadata.name);
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

   protected transformError(e: MetadataErrorClassDefinition): BinarySymbolStruct {
      // TODO Complete
      const symbol = this.createSymbol().setName(e.name);
      symbol.addBits(SymbolBitFlags.IsError);
      return symbol;
   }

   protected transformInterface(e: MetadataInterfaceDefinition): BinarySymbolStruct {
      const symbol = this.createSymbol().setName(e.name);
      symbol.addBits<BinarySymbolStruct & SymbolBuilder>(SymbolBitFlags.IsInterface).isInterfaceData = {
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
   readonly detailsRef: (_: NonNullable<MetadataFunctionArgumentDetailsDefinition>) => number;
};

export class SymbolBuilder implements BinarySymbolStruct {
   public static CreateSymbolFactory(context: ContextSymbolBuilder): () => SymbolBuilder {
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
      this.bitFlags |= SymbolBitFlags.IsBindType;
      this.bindType = this.context.typeRef(type);
      return this;
   }
   public setArguments<T extends SymbolBuilderStruct>(this: T, type: MetadataFunctionArgumentDefinition[]): T {
      this.bitFlags |= SymbolBitFlags.IsFunction;
      this.functionArguments = type.map(e => this.context.typeRef(e.type));
      if (type.some(e => e.details)) {
         this.bitFlags |= SymbolBitFlags.IsDetailedFunction;
         this.functionArgumentsDetails = type.map(e => (e.details ? this.context.detailsRef(e.details) : -1));
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

      this.bitFlags |= SymbolBitFlags.HasValue;
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
}
