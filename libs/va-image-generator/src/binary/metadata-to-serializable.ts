import {
   CurrentBinaryImageSerializer,
   ImageGeneralHeaderData,
   ImageModuleData,
   ModuleMetadata,
   SerializableSymbol,
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
} from '@bedrock-apis/types';
import { IMetadataProvider } from '../metadata-provider';
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

export class MetadataToSerializable {
   protected readonly stringCollector = new IndexedCollector<string>();
   protected readonly toIndex = this.stringCollector.toIndex.bind(this.stringCollector);

   protected readonly typesCollector = new IndexedCollector<MetadataType>(k => JSON.stringify(k)); // fast enough actually
   protected readonly typeToIndex = this.typesCollector.toIndex.bind(this.typesCollector);

   protected readonly detailsCollector = new IndexedCollector<MetadataFunctionArgumentDetailsDefinition>(k =>
      JSON.stringify(k),
   );

   public async serialize(metadataProvider: IMetadataProvider) {
      const toIndex = this.toIndex;
      const modules: SerializableModule[] = [];

      for await (const metadata of metadataProvider.getMetadataModules()) {
         metadata.enums ||= [];

         const symbols: SerializableSymbol[] = [];
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

   protected typeToSymbol(e: MetadataType): SerializableSymbol {
      // TODO Complete
      return {
         bitFlags: SymbolBitFlags.HasType,
         name: this.toIndex(e.name),
      };
   }

   protected enumToSymbol(e: MetadataEnumDefinition): SerializableSymbol {
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

   protected errorToSymbol(e: MetadataErrorClassDefinition): SerializableSymbol {
      // TODO Complete
      return {
         bitFlags: SymbolBitFlags.IsError,
         name: this.toIndex(e.name),
      };
   }

   protected interfaceToSymbol(e: MetadataInterfaceDefinition): SerializableSymbol {
      return {
         bitFlags: SymbolBitFlags.IsInterface,
         name: this.toIndex(e.name),
         isInterfaceData: {
            keys: e.properties.map(e => this.toIndex(e.name)),
            types: e.properties.map(e => this.typeToIndex(e.type)),
         },
      };
   }

   protected objectToSymbol(e: MetadataObjectDefinition): SerializableSymbol {
      return {
         bitFlags: SymbolBitFlags.IsObject | SymbolBitFlags.HasType,
         name: this.toIndex(e.name),
         hasType: this.typeToIndex(e.type),
      };
   }

   protected functionToSymbol(
      e: MetadataFunctionDefinition,
      addFlags = 0,
      overrideSymbol: Partial<SerializableSymbol> = {},
   ): SerializableSymbol {
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

   protected constantToSymbol(e: MetadataConstantDefinition): SerializableSymbol {
      let bitFlags = SymbolBitFlags.IsConstant;
      if (typeof e.value !== 'undefined') bitFlags |= SymbolBitFlags.HasValue;
      return {
         bitFlags,
         name: this.toIndex(e.name),
         hasValue: e.value,
      };
   }

   protected classesToSymbol(e: MetadataClassDefinition[]): SerializableSymbol[] {
      const symbolicatedClasses = new Set<string>();

      return e.map(c => this.classToSymbol(symbolicatedClasses, c, e)).flat();
   }

   protected classToSymbol(
      symbolicatedClasses: Set<string>,
      c: MetadataClassDefinition,
      all: MetadataClassDefinition[],
   ): SerializableSymbol[] {
      symbolicatedClasses.add(c.name);

      const parent = c.base_types[0];
      if (parent && !parent.from_module && !symbolicatedClasses.has(parent.name)) {
         const definition = all.find(e => e.name === parent.name);
         if (!definition) throw new TypeError(`Missing parent class definition ${parent.name} for ${c.name}`);
         this.classToSymbol(symbolicatedClasses, definition, all);
      }
      const constructor = c.functions.find(e => e.is_constructor);
      const symbols: SerializableSymbol[] = [];
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
