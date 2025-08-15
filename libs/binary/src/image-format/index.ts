import { BitFlags } from '@bedrock-apis/common';
import { BinaryIOReader, DataCursorView, SafeBinaryIOWriter } from '../binary';
import { BinaryIO } from '../binary/io';
import { IMAGE_GENERAL_DATA_MAGIC } from '../constants';
import {
   BinaryDetailsStruct,
   BinaryDetailsType,
   BinarySymbolStruct,
   ExportType,
   ImageHeader,
   ImageModuleData,
   SymbolBitFlags,
} from '../types';
import { SerializableMetadata, SerializableModule } from '../types/module-data';
import { BinaryTypeStruct, TypeBitFlagsU16 } from '../types/types';

const { allOf: AllOf } = BitFlags;

// Keep Strict Order of the Binary Writer methods
export class BinaryImageFormat {
   protected constructor() {}

   public static write(data: SerializableMetadata) {
      const buffer = DataCursorView.alloc(2 ** 16 * 10); // 196608 bytes -> 192 kb
      data.version = 1;

      const io = new SafeBinaryIOWriter(buffer, data as object) as unknown as BinaryIO<SerializableMetadata>;
      this.marshal(io);

      return io.data.getBuffer();
   }

   public static read(source: Uint8Array<ArrayBufferLike>) {
      const buffer = new DataCursorView(source);
      buffer.pointer = 0;
      const io = new BinaryIOReader(buffer, {}) as unknown as BinaryIO<SerializableMetadata>;
      this.marshal(io);
      return io.storage;
   }

   protected static marshal(io: BinaryIO<SerializableMetadata>): void {
      io.magic(IMAGE_GENERAL_DATA_MAGIC);
      io.uint32('version');
      this.header(io.sub('metadata'));
      io.array8('modules', io => this.module(io));
   }

   protected static header(io: BinaryIO<ImageHeader>): void {
      io.dynamic('metadata');
      io.string8Array16('stringSlices');
      io.array16('details', io => this.details(io));
      io.array16('types', io => this.type(io));
   }

   protected static details(io: BinaryIO<BinaryDetailsStruct>) {
      io.uint8('type');
      if (io.storage.type === BinaryDetailsType.Empty) return;

      io.dynamic('defaultValue');
      if (io.storage.type === BinaryDetailsType.Range) {
         io.float64('maxValue');
         io.float64('minValue');
      }
   }

   protected static module(io: BinaryIO<SerializableModule>): void {
      const start = io.data.pointer;

      this.moduleHeader(io.sub('metadata'));
      io.encapsulate16(() => this.moduleData(io.sub('data')));

      console.log(
         `Module '${io.storage.metadata.name}' ${io.storage.metadata.version} size: ${io.data.pointer - start}`,
      );
   }

   protected static moduleHeader(io: BinaryIO<SerializableModule['metadata']>): void {
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

   protected static moduleData(io: BinaryIO<ImageModuleData>): void {
      io.array16('symbols', io => this.symbol(io));
      io.uint16Array16('exports');
   }

   protected static type(io: BinaryIO<BinaryTypeStruct>): void {
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

   protected static symbol(io: BinaryIO<BinarySymbolStruct>): void {
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

   protected static interfaceData(io: BinaryIO<NonNullable<BinarySymbolStruct['isInterfaceData']>>): void {
      io.uint16Array8('keys');
      io.uint16Array8('types');
   }

   protected static enumData(io: BinaryIO<NonNullable<BinarySymbolStruct['isEnumData']>>): void {
      io.bool('isNumerical');
      io.uint16Array16('keys');
      io.uint16Array16('values');
   }
}
