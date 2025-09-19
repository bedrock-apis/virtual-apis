import { BinaryIO, Marshaller } from '@bedrock-apis/va-binary';
import { BitFlags } from '@bedrock-apis/va-common';
import { IMAGE_GENERAL_DATA_MAGIC } from './constants';
import {
   BinaryDetailsStruct,
   BinaryDetailsType,
   BinarySymbolStruct,
   ExportType,
   ImageHeader,
   ImageModuleData,
   SymbolBitFlags,
} from './types';
import { SerializableMetadata, SerializableModule } from './types/module-data';
import { BinaryTypeStruct, TypeBitFlagsU16 } from './types/types';

const { allOf: AllOf } = BitFlags;

// Keep Strict Order of the Binary Writer methods
export class BinaryImageFormat extends Marshaller<SerializableMetadata> {
   protected override version = 1;

   protected override magic = IMAGE_GENERAL_DATA_MAGIC;

   protected marshal(io: BinaryIO<SerializableMetadata>): void {
      this.header(io.sub('metadata'));
      io.array8('modules', io => this.module(io));
      io.array8('jsModules', io => this.jsModule(io));
   }

   protected header(io: BinaryIO<ImageHeader>): void {
      io.dynamic('metadata');
      io.string8Array16('stringSlices');
      io.array16('details', io => this.details(io));
      io.array16('types', io => this.type(io));
   }

   protected details(io: BinaryIO<BinaryDetailsStruct>) {
      io.uint8('type');
      if (io.storage.type === BinaryDetailsType.Empty) return;

      io.dynamic('defaultValue');
      if (io.storage.type === BinaryDetailsType.Range) {
         io.float64('maxValue');
         io.float64('minValue');
      }
   }
   protected jsModule(io: BinaryIO<SerializableMetadata['jsModules'][number]>) {
      io.string8('name');
      io.string8('filename');
      io.string32('code');
   }

   protected module(io: BinaryIO<SerializableModule>): void {
      // const start = io.data.pointer;

      this.moduleHeader(io.sub('metadata'));
      io.encapsulate16(() => this.moduleData(io.sub('data')));

      // console.log(
      //    `Module '${io.storage.metadata.name}' ${io.storage.metadata.version} size: ${io.data.pointer - start}`,
      // );
   }

   protected moduleHeader(io: BinaryIO<SerializableModule['metadata']>): void {
      io.index('name');
      io.index('uuid');
      io.index('version');
      io.array8('dependencies', io => {
         io.index('name');
         io.index('uuid');
         io.index('name');
         io.uint16Array8('versions');
      });
   }

   protected moduleData(io: BinaryIO<ImageModuleData>): void {
      io.array16('symbols', io => this.symbol(io));
      io.uint16Array16('exports');
   }

   protected type(io: BinaryIO<BinaryTypeStruct>): void {
      io.uint16('flags');

      // No return because combines with other extended refs
      if (AllOf(io.storage.flags, TypeBitFlagsU16.HasErrorableExtraData)) io.uint16Array8('errorTypes');

      // If Bind Type Ref
      if (AllOf(io.storage.flags, TypeBitFlagsU16.IsBindType)) {
         io.index('bindTypeNameId');
         if (AllOf(io.storage.flags, TypeBitFlagsU16.IsExternalBindType)) {
            io.sub('fromModuleInfo').index('nameId').index('version');
         }
         return;
      }

      if (AllOf(io.storage.flags, TypeBitFlagsU16.IsNumberType)) {
         io.sub('numberRange').float64('min').float64('max');
         return;
      }

      // Type with types
      if (AllOf(io.storage.flags, TypeBitFlagsU16.HasSingleParamBit)) {
         io.uint16('extendedRef');
         return;
      } else if (AllOf(io.storage.flags, TypeBitFlagsU16.HasMultiParamsBit)) {
         io.uint16Array8('extendedRefs');
      }
   }

   protected symbol(io: BinaryIO<BinarySymbolStruct>): void {
      io.uint32('bitFlags');
      io.index('name');

      if (io.storage.bitFlags === 0) return;

      // Strict Order Do not change!!!
      switch (io.storage.bitFlags & SymbolBitFlags.ExportTypeMask) {
         case ExportType.Enum:
            this.enumData(io.sub('isEnumData'));
            break;
         case ExportType.Interface:
            this.interfaceData(io.sub('isInterfaceData'));
            break;
         case ExportType.Constant:
            io.dynamic('hasValue');
            break;
         case ExportType.Function:
            io.uint16Array8('functionArguments');
            if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsDetailedFunction)) {
               io.uint16Array8('functionArgumentsDetails');
            }
            break;
         default:
            break;
      }
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsInvocable)) io.uint16Array8('invocablePrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasSetter)) io.uint16Array8('setterPrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasType)) io.index('hasType');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsBound)) io.index('boundTo');
   }

   protected interfaceData(io: BinaryIO<NonNullable<BinarySymbolStruct['isInterfaceData']>>): void {
      io.uint16Array8('keys');
      io.uint16Array8('types');
   }

   protected enumData(io: BinaryIO<NonNullable<BinarySymbolStruct['isEnumData']>>): void {
      io.bool('isNumerical');
      io.uint16Array16('keys');
      io.uint16Array16('values');
   }
}
