import {
   BinarySymbolStruct,
   CurrentBinaryImageSerializer,
   ImageGeneralHeaderData,
   ImageModuleData,
   IndexId,
   ModuleMetadata,
   SymbolBitFlags,
} from '@bedrock-apis/binary';
import {
   MetadataClassDefinition,
   MetadataConstantDefinition,
   MetadataEnumDefinition,
   MetadataErrorClassDefinition,
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

export class MetadataToSerializableTransformer {
   protected readonly stringCollector = new IndexedCollector<string>();
   protected readonly stringRef = this.stringCollector.getIndexFor.bind(this.stringCollector);

   protected readonly typesCollector = new IndexedCollector<MetadataType>(JSON.stringify); // fast enough actually
   protected readonly typeRef = this.typesCollector.getIndexFor.bind(this.typesCollector);
   protected readonly createSymbol = SymbolBuilder.CreateSymbolFactory({
      stringRef: this.stringRef,
      typeRef: this.typeRef,
   });

   protected readonly detailsCollector = new IndexedCollector<MetadataFunctionArgumentDetailsDefinition>(
      JSON.stringify,
   );

   public async transform(metadataProvider: IMetadataProvider) {
      const toIndex = this.toIndex;
      const modules: SerializableModule[] = [];

      for await (const metadata of metadataProvider.getMetadataModules()) {
         metadata.enums ??= [];

         const symbols: BinarySymbolStruct[] = [];
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
               name: toIndex(metadata.name),
               uuid: toIndex(metadata.uuid),
               version: toIndex(metadata.version),
               dependencies: metadata.dependencies.map(e => ({
                  name: toIndex(e.name),
                  uuid: toIndex(e.uuid),
                  versions: e.versions?.map(v => toIndex(v.version)),
               })),
            },
            data: {
               symbols,
               exports: [
                  ...metadata.enums.map(c => toIndex(c.name)),
                  ...metadata.classes.map(c => toIndex(c.name)),
                  ...metadata.errors.map(c => toIndex(c.name)),
                  ...metadata.functions.map(c => toIndex(c.name)),
                  ...metadata.objects.map(c => toIndex(c.name)),
                  ...metadata.constants.map(c => toIndex(c.name)),
               ],
            },
         });

         symbols.push(
            ...metadata.enums.map(this.enumToSymbol.bind(this)),
            ...metadata.interfaces.map(this.interfaceToSymbol.bind(this)),
            ...metadata.errors.map(this.errorToSymbol.bind(this)),
            ...metadata.functions.map(e => this.functionToSymbol(e)),
            ...metadata.objects.map(this.objectToSymbol.bind(this)),
            ...metadata.constants.map(this.constantToSymbol.bind(this)),
            ...this.classesToSymbol(metadata.classes),
         );

         stats.uniqueTypes = this.typesCollector.getArray().length - stats.uniqueTypes;
      }

      const metadata: ImageGeneralHeaderData = {
         metadata: { engine: toIndex('1.21.80.0') },
         stringSlices: this.stringCollector.getArray(),
         version: CurrentBinaryImageSerializer.version,
      };

      console.log(this.detailsCollector.getArray());

      return { metadata, modules };
   }
   protected *transformModule(metadata: StrippedMetadataModuleDefinition): Generator<BinarySymbolStruct> {
      for (const cl of metadata.classes) yield* this.transformClass(cl);
   }
   protected *transformClass(metadata: MetadataClassDefinition): Generator<BinarySymbolStruct> {
      // Yield class it self
      const symbol = this.createSymbol().addBits(SymbolBitFlags.IsClass).setName(metadata.name);
      yield symbol;
      yield* metadata.functions.map(e => {
         const $ = this.createSymbol().setName(e.name).setInvocable(e.call_privilege);
         if (e.is_static) $.addBits(SymbolBitFlags.IsStatic);
         if (e.is_constructor) $.addBits(SymbolBitFlags.IsConstructor);

         return $;
      });

      // Inherits from
      if (metadata.base_types[0]) {
         symbol.bitFlags |= SymbolBitFlags.HasType;
         symbol.hasType = this.typeRef(metadata.base_types[0]);
      }

      yield symbol;
      for (const func of metadata.functions) void 0;
   }

   protected typeToSymbol(e: MetadataType): BinarySymbolStruct {
      // TODO Complete
      return {
         bitFlags: SymbolBitFlags.HasType,
         name: this.toIndex(e.name),
      };
   }

   protected enumToSymbol(e: MetadataEnumDefinition): BinarySymbolStruct {
      const hasNumericalValues = e.constants.some(e => typeof e.value === 'number');
      return {
         bitFlags: SymbolBitFlags.IsEnum,
         name: this.toIndex(e.name),
         isEnumData: {
            hasNumericalValues,
            values: e.constants.map(e => (hasNumericalValues ? (e.value as number) : this.toIndex(e.value as string))),
            keys: e.constants.map(e => this.toIndex(e.name)),
         },
      };
   }

   protected errorToSymbol(e: MetadataErrorClassDefinition): BinarySymbolStruct {
      // TODO Complete
      return {
         bitFlags: SymbolBitFlags.IsError,
         name: this.toIndex(e.name),
      };
   }

   protected interfaceToSymbol(e: MetadataInterfaceDefinition): BinarySymbolStruct {
      return {
         bitFlags: SymbolBitFlags.IsInterface,
         name: this.toIndex(e.name),
         isInterfaceData: {
            keys: e.properties.map(e => this.toIndex(e.name)),
            types: e.properties.map(e => this.typeToIndex(e.type)),
         },
      };
   }

   protected objectToSymbol(e: MetadataObjectDefinition): BinarySymbolStruct {
      return {
         bitFlags: SymbolBitFlags.IsObject | SymbolBitFlags.HasType,
         name: this.toIndex(e.name),
         hasType: this.typeToIndex(e.type),
      };
   }

   protected functionToSymbol(
      e: MetadataFunctionDefinition,
      addFlags = 0,
      overrideSymbol: Partial<BinarySymbolStruct> = {},
   ): BinarySymbolStruct {
      let bitFlags = SymbolBitFlags.IsFunction | addFlags;
      if (e.is_static) bitFlags |= SymbolBitFlags.IsStatic | SymbolBitFlags.IsBindType;

      e.arguments.forEach(e => this.detailsCollector.toIndex(e.details));
      return {
         bitFlags: SymbolBitFlags.IsFunction | SymbolBitFlags.HasType | addFlags,
         name: this.toIndex(e.name),
         invocablePrivileges: [this.toIndex(e.privilege)],

         // TODO Somehow store e.type.details
         functionArguments: e.arguments.map(e => this.typeToIndex(e.type)),
         ...overrideSymbol,
      };
   }

   protected constantToSymbol(e: MetadataConstantDefinition): BinarySymbolStruct {
      let bitFlags = SymbolBitFlags.IsConstant;
      if (typeof e.value !== 'undefined') bitFlags |= SymbolBitFlags.HasValue;
      return {
         bitFlags,
         name: this.toIndex(e.name),
         hasValue: e.value,
      };
   }

   protected classesToSymbol(e: MetadataClassDefinition[]): BinarySymbolStruct[] {
      const symbolicatedClasses = new Set<string>();

      return e.map(c => this.classToSymbol(symbolicatedClasses, c, e)).flat();
   }

   protected classToSymbol(
      symbolicatedClasses: Set<string>,
      c: MetadataClassDefinition,
      all: MetadataClassDefinition[],
   ): BinarySymbolStruct[] {
      symbolicatedClasses.add(c.name);

      const parent = c.base_types[0];
      if (parent && !parent.from_module && !symbolicatedClasses.has(parent.name)) {
         const definition = all.find(e => e.name === parent.name);
         if (!definition) throw new TypeError(`Missing parent class definition ${parent.name} for ${c.name}`);
         this.classToSymbol(symbolicatedClasses, definition, all);
      }
      const constructor = c.functions.find(e => e.is_constructor);
      const symbols: BinarySymbolStruct[] = [];
      const bindType = this.typeToIndex(c.type);

      if (constructor) {
         symbols.push(
            this.functionToSymbol(constructor, SymbolBitFlags.IsConstructor | SymbolBitFlags.IsBindType, {
               bindType,
            }),
         );
      }

      for (const fn of c.functions) {
         if (fn === constructor) continue;
         symbols.push(
            this.functionToSymbol(
               fn,
               (fn.is_static ? SymbolBitFlags.IsStatic : SymbolBitFlags.IsProperty) | SymbolBitFlags.IsBindType,
               { bindType },
            ),
         );
      }

      for (const p of c.properties) {
         symbols.push({
            // TODO Handle privileges of setter
            bitFlags:
               SymbolBitFlags.IsProperty |
               SymbolBitFlags.HasType |
               SymbolBitFlags.IsBindType |
               (p.is_read_only ? 0 : SymbolBitFlags.HasSetter),
            name: this.toIndex(p.name),
            invocablePrivileges: [this.toIndex(p.privilege)],
            setterPrivileges: p.is_read_only ? undefined : [this.toIndex(p.privilege)],
            hasType: this.typeToIndex(p.type),
            bindType,
         });
      }

      for (const p of c.constants) {
         // TODO Handle is_read_only
         symbols.push({
            bitFlags:
               SymbolBitFlags.IsStatic |
               SymbolBitFlags.IsBindType |
               (typeof p.value !== 'undefined' ? SymbolBitFlags.HasValue : 0),
            name: this.toIndex(p.name),
            hasValue: p.value,
            bindType,
         });
      }

      // TODO Handle c.iterator

      return symbols;
   }
}

type SymbolBuilderStruct = SymbolBuilder & BinarySymbolStruct;
type ContextSymbolBuilder = {
   readonly stringRef: (_: string) => number;
   readonly typeRef: (_: MetadataType) => number;
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
   public addBits<T extends SymbolBuilderStruct>(this: T, bits: number): T {
      this.bitFlags |= bits;
      return this;
   }
   public removeBits<T extends SymbolBuilderStruct>(this: T, bits: number): T {
      this.bitFlags &= ~bits;
      return this;
   }
}
