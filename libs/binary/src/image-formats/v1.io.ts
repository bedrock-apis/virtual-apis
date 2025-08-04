import { BitFlags } from '@bedrock-apis/common';
import { BinaryIO } from '../binary/io';
import { BinarySymbolStruct, ImageModuleData, SymbolBitFlags } from '../types';
import { BinaryTypeStruct, TypeBitFlags } from '../types/types';
import { BaseBinaryImageSerializer } from './base-format';

const { AllOf, AnyOf } = BitFlags;

// Keep Strict Order of the Binary Writer methods
export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;

   protected static ImageModuleData(io: BinaryIO<ImageModuleData>): void {
      io.array16('symbols', this.Symbol);
      io.uint16Array16('exports');
   }

   protected static Type(io: BinaryIO<BinaryTypeStruct>): void {
      io.uint8('bitType');

      // If Bind Type Ref
      if (AnyOf(io.storage.bitType, TypeBitFlags.IsBindRef)) {
         io.index('bindTypeNameId');
         if (AnyOf(io.storage.bitType, TypeBitFlags.IsExtended)) {
            io.sub('fromModuleInfo').index('nameId').index('version');
         }
         return;
      }

      // Writing Numbers
      if (AllOf(io.storage.bitType, TypeBitFlags.IsNumber | TypeBitFlags.IsExtended)) {
         io.sub('numberRange').float64('max').float64('min');
         return;
      }

      // Type with types
      if (AnyOf(io.storage.bitType, TypeBitFlags.IsExtended)) {
         io.uint16Array8('extendedRefs');
         return;
      }
   }

   protected static Symbol(io: BinaryIO<BinarySymbolStruct>): void {
      io.index('name');
      io.uint16('bitFlags');

      if (io.storage.bitFlags === 0) return;

      // Strict Order Do not change!!!
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsEnum)) this.EnumData(io.sub('isEnumData'));
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsInterface)) this.InterfaceData(io.sub('isInterfaceData'));
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsInvocable)) io.uint16Array8('invocablePrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasSetter)) io.uint16Array8('setterPrivileges');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasType)) io.index('hasType');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsBindType)) io.index('bindType');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.HasValue)) io.dynamic('hasValue');
      if (AllOf(io.storage.bitFlags, SymbolBitFlags.IsFunction))
         throw new ReferenceError('Params has to be implemented');
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
