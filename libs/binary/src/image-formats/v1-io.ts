import { BitFlags } from '@bedrock-apis/common';
import {
   SerializableMetadata,
   SerializableModule,
} from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { BinaryIO } from '../binary/io';
import { BinarySymbolStruct, ImageHeader, ImageModuleData, SymbolBitFlags } from '../types';
import { BinaryTypeStruct, TypeBitFlags } from '../types/types';
import { BaseBinaryIOImageSerializer } from './base-format-io';

const { AllOf, AnyOf } = BitFlags;

// Keep Strict Order of the Binary Writer methods
export class BinaryImageSerializerIOV1 extends BaseBinaryIOImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;

   protected static override Marshal(io: BinaryIO<SerializableMetadata>): void {
      this.Header(io.sub('metadata'));
      io.array8('modules', io => this.Module(io));
   }

   protected static Header(io: BinaryIO<ImageHeader>): void {
      io.dynamic('metadata');
      io.string8Array16('stringSlices');
      // io.dynamic('details');
      io.array16('types', io => this.Type(io));
   }

   protected static Module(io: BinaryIO<SerializableModule>): void {
      const start = io.data.pointer;

      this.ModuleHeader(io.sub('metadata'));
      io.encapsulate16(() => this.ModuleData(io.sub('data')));

      console.log(
         `Module '${io.storage.id}', uniqueTypes ${io.storage.stats?.uniqueTypes} size: ${io.data.pointer - start}`,
      );
   }

   protected static ModuleHeader(io: BinaryIO<SerializableModule['metadata']>): void {
      io.index('name');
      io.index('uuid');
      io.index('version');
      io.array8('dependencies', io => {
         io.index('uuid');
         io.uint16Array8('versions');
      });
   }

   protected static ModuleData(io: BinaryIO<ImageModuleData>): void {
      io.array16('symbols', io => this.Symbol(io));
      io.uint16Array16('exports');
   }

   protected static Type(io: BinaryIO<BinaryTypeStruct>): void {
      io.uint16('bitType');

      // If Bind Type Ref
      if (AllOf(io.storage.bitType, TypeBitFlags.IsBindRef)) {
         io.index('bindTypeNameId');
         if (AllOf(io.storage.bitType, TypeBitFlags.IsExternal)) {
            io.sub('fromModuleInfo').index('nameId').index('version');
         }
         return;
      }

      if (AllOf(io.storage.bitType, TypeBitFlags.IsNumber)) {
         io.sub('numberRange').float64('min').float64('max');
         return;
      }

      // No return because combines with other extended refs
      if (AllOf(io.storage.bitType, TypeBitFlags.ErrorableTypes)) io.uint16Array8('errorTypes');

      // Type with types
      if (AllOf(io.storage.bitType, TypeBitFlags.IsExtended)) {
         if (AllOf(io.storage.bitType, TypeBitFlags.IsComplex)) {
            io.uint16Array8('extendedRefs');
         } else {
            if (!io.storage.extendedRef) console.log();
            io.uint16('extendedRef');
         }
         return;
      }
   }

   protected static Symbol(io: BinaryIO<BinarySymbolStruct>): void {
      io.index('name');
      io.uint32('bitFlags');

      if (io.storage.bitFlags === 0) return;

      // Strict Order Do not change!!!
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsEnum)) this.EnumData(io.sub('isEnumData'));
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsInterface)) this.InterfaceData(io.sub('isInterfaceData'));
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsInvocable)) io.uint16Array8('invocablePrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasSetter)) io.uint16Array8('setterPrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasType)) io.index('hasType');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsBindType)) io.index('bindType');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasValue)) io.dynamic('hasValue');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsFunction)) {
         io.uint16Array8('functionArguments');
         if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsDetailedFunction)) {
            io.uint16Array8('functionArgumentsDetails');
         }
      }
   }

   protected static InterfaceData(io: BinaryIO<NonNullable<BinarySymbolStruct['isInterfaceData']>>): void {
      io.uint16Array8('keys');
      io.uint16Array8('types');
   }

   protected static EnumData(io: BinaryIO<NonNullable<BinarySymbolStruct['isEnumData']>>): void {
      io.bool('hasNumericalValues');
      io.uint16Array16('keys');
      io.uint16Array16('values');
   }
}
