import {
   CurrentBinaryImageSerializer,
   ImageGeneralHeaderData,
   SerializableSymbol,
   SymbolBitFlags,
} from '@bedrock-apis/binary';
import {
   MetadataClassDefinition,
   MetadataConstantDefinition,
   MetadataEnumDefinition,
   MetadataErrorClassDefinition,
   MetadataFunctionDefinition,
   MetadataInterfaceDefinition,
   MetadataObjectDefinition,
   MetadataType,
} from '@bedrock-apis/types';
import { IMetadataProvider } from '../../metadata-provider';
import { IndexedCollector, IndexedObjectCollector } from '../indexed-collector';
import { SerializableModule, SerializableModuleStats } from './index';

// TODO Rewrite to be static class MetadataToSerializable
// TODO USe IndexedCollector(hash)

export async function toSerializable(metadataProvider: IMetadataProvider) {
   const stringCollector = new IndexedCollector<string>();
   const toIndex = stringCollector.toIndex.bind(stringCollector);
   const modules: SerializableModule[] = [];

   for await (const metadata of metadataProvider.getMetadataModules()) {
      metadata.enums ||= [];

      const symbols: SerializableSymbol[] = [];
      const stats: SerializableModuleStats = {
         uniqueTypes: 0,
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

      // We can move it to the root too tho, it will be crazy optimization
      const typesCollector = new IndexedObjectCollector<MetadataType>(stringCollector);
      const typeToIndex = typesCollector.toIndex.bind(typesCollector);

      symbols.push(
         ...metadata.enums.map(enumToSymbol),
         ...metadata.interfaces.map(interfaceToSymbol),
         ...metadata.errors.map(errorToSymbol),
         ...metadata.functions.map(functionToSymbol),
         ...metadata.objects.map(objectToSymbol),
         ...metadata.constants.map(constantToSymbol),
         ...classesToSymbol(metadata.classes),
      );

      // Insert types at the start
      symbols.unshift(...typesCollector.getArray().map(typeToSymbol));

      stats.uniqueTypes = typesCollector.getArray().length;

      function typeToSymbol(e: MetadataType): SerializableSymbol {
         // TODO Complete
         return {
            bitFlags: SymbolBitFlags.HasType,
            name: toIndex(e.name),
         };
      }

      function enumToSymbol(e: MetadataEnumDefinition): SerializableSymbol {
         const hasNumericalValues = e.constants.some(e => typeof e.value === 'number');
         return {
            bitFlags: SymbolBitFlags.IsEnum,
            name: toIndex(e.name),
            isEnumData: {
               hasNumericalValues,
               values: e.constants.map(e => (hasNumericalValues ? (e.value as number) : toIndex(e.value as string))),
               keys: e.constants.map(e => toIndex(e.name)),
            },
         };
      }

      function errorToSymbol(e: MetadataErrorClassDefinition): SerializableSymbol {
         // TODO Complete
         return {
            bitFlags: SymbolBitFlags.IsError,
            name: toIndex(e.name),
         };
      }

      function interfaceToSymbol(e: MetadataInterfaceDefinition): SerializableSymbol {
         return {
            bitFlags: SymbolBitFlags.IsInterface,
            name: toIndex(e.name),
            isInterfaceData: {
               keys: e.properties.map(e => toIndex(e.name)),
               types: e.properties.map(e => typeToIndex(e.type)),
            },
         };
      }

      function objectToSymbol(e: MetadataObjectDefinition): SerializableSymbol {
         return {
            bitFlags: SymbolBitFlags.IsObject | SymbolBitFlags.HasType,
            name: toIndex(e.name),
            hasType: typeToIndex(e.type),
         };
      }

      function functionToSymbol(
         e: MetadataFunctionDefinition,
         _: number,
         __: unknown[],
         extraFlags = 0,
      ): SerializableSymbol {
         return {
            bitFlags: SymbolBitFlags.IsFunction,
            name: toIndex(e.name),

            // TODO Somehow store e.type.details
            functionArguments: e.arguments.map(e => typeToIndex(e.type)),
         };
      }

      function constantToSymbol(e: MetadataConstantDefinition): SerializableSymbol {
         let bitFlags = SymbolBitFlags.IsConstant;
         if (typeof e.value !== 'undefined') bitFlags |= SymbolBitFlags.HasValue;
         return {
            bitFlags,
            name: toIndex(e.name),
            hasValue: e.value,
         };
      }

      function classesToSymbol(e: MetadataClassDefinition[]): SerializableSymbol[] {
         const symbolicatedClasses = new Set<string>();

         return e.map(c => classToSymbol(symbolicatedClasses, c, e)).flat();
      }

      function classToSymbol(
         symbolicatedClasses: Set<string>,
         e: MetadataClassDefinition,
         all: MetadataClassDefinition[],
      ): SerializableSymbol[] {
         symbolicatedClasses.add(e.name);

         const parent = e.base_types[0];
         if (parent && !parent.from_module && !symbolicatedClasses.has(parent.name)) {
            const definition = all.find(e => e.name === parent.name);
            if (!definition) throw new TypeError(`Missing parent class definition ${parent.name} for ${e.name}`);
            classToSymbol(symbolicatedClasses, definition, all);
         }
         const constructor = e.functions.find(e => e.is_constructor);

         return [
            constructor ? functionToSymbol(constructor, 0, [], SymbolBitFlags.IsConstructor) : undefined,
            ...e.functions
               .filter(e => e !== constructor)
               .map(e => functionToSymbol(e, 0, [], e.is_static ? SymbolBitFlags.IsStatic : SymbolBitFlags.IsProperty)),
         ].filter(e => !!e);
      }
   }

   const metadata: ImageGeneralHeaderData = {
      metadata: { engine: toIndex('1.21.80.0') },
      stringSlices: stringCollector.getArray(),
      version: CurrentBinaryImageSerializer.version,
   };

   console.log(stringCollector.getArray());

   return { metadata, modules };
}
