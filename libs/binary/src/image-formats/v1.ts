/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BitFlags } from '@bedrock-apis/common';
import { GeneralNBTFormatWriter } from '../../ref-bapi-nbt/base';
import { NBTTag } from '../../ref-bapi-nbt/tag';
import { BinaryReader, BinaryWriter } from '../binary';
import { StaticDataSource } from '../binary/static-data-source';
import { BinarySymbolStruct, ImageModuleData, IndexId, SymbolBitFlags } from '../types';
import { BinaryTypeStruct, TypeBitFlags } from '../types/types';
import { BaseBinaryImageSerializer } from './base-format';

const { AllOf } = BitFlags;

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public static readonly ReadIndexRef = BinaryReader.ReadUint16;
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public static readonly WriteIndexRef = BinaryWriter.WriteUint16;
   public static override ReadModuleField(_: StaticDataSource): ImageModuleData {
      const symbols = this.ReadSymbols(_);
      const exports = this.ReadExportIndexes(_);
      return { exports, symbols };
   }
   public static override WriteModuleField(_: StaticDataSource, m: ImageModuleData): void {
      this.WriteExportIndexes(_, m.exports);
   }

   //#region Readers
   protected static ReadTypes(_: StaticDataSource): BinaryTypeStruct[] {
      const size = BinaryReader.ReadUint16(_);
      const array: BinaryTypeStruct[] = [];
      for (let i = 0; i < size; i++) array[array.length] = this.ReadType(_);
      return array;
   }
   protected static ReadType(_: StaticDataSource): BinaryTypeStruct {
      const bitKind = BinaryReader.ReadUint8(_);
      const type: BinaryTypeStruct = { bitType: bitKind };
      // Keep Strict Order of the Binary Reader methods

      // If Bind Type Ref
      if (BitFlags.AnyOf(bitKind, TypeBitFlags.IsBindRef)) {
         type.bindTypeNameId = this.ReadIndexRef(_);
         if (BitFlags.AnyOf(bitKind, TypeBitFlags.IsExtended))
            type.fromModuleInfo = {
               nameId: this.ReadIndexRef(_),
               version: this.ReadIndexRef(_),
            };
         return type;
      }

      // Reading Numbers
      if (AllOf(bitKind, TypeBitFlags.IsNumber | TypeBitFlags.IsExtended)) {
         type.numberRange = {
            max: BinaryReader.ReadFloat64(_),
            min: BinaryReader.ReadFloat64(_),
         };
         return type;
      }

      // Type with types
      if (BitFlags.AnyOf(bitKind, TypeBitFlags.IsExtended)) {
         type.extendedRefs = BitFlags.AnyOf(bitKind, TypeBitFlags.IsComplex)
            ? [this.ReadIndexRef(_)]
            : this.ReadMinimalReferences(_);
         return type;
      }

      return type;
   }
   protected static ReadSymbols(_: StaticDataSource): BinarySymbolStruct[] {
      const size = BinaryReader.ReadUint16(_);
      const array: BinarySymbolStruct[] = [];
      for (let i = 0; i < size; i++) array[array.length] = this.ReadSymbol(_);
      return array;
   }
   protected static ReadSymbol(_: StaticDataSource): BinarySymbolStruct {
      const bitFlags = BinaryReader.ReadUint16(_);
      const name = this.ReadIndexRef(_);
      const symbol: BinarySymbolStruct = { name, bitFlags };

      // -------------------
      // Strict Order
      // -------------------
      if (bitFlags === 0) return symbol;

      // Strict Order Do not change!!!
      if (AllOf(bitFlags, SymbolBitFlags.IsEnum)) symbol.isEnumData = this.ReadEnumData(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsInterface)) symbol.isInterfaceData = this.ReadInterfaceData(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsInvocable)) symbol.invocablePrivileges = this.ReadPrivileges(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasSetter)) symbol.setterPrivileges = this.ReadPrivileges(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasType)) symbol.hasType = this.ReadIndexRef(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsBindType)) symbol.bindType = this.ReadIndexRef(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasValue)) symbol.hasValue = this.ReadDynamicValue(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsFunction)) throw new ReferenceError('Params has to be implemented');

      return symbol;
   }
   protected static ReadDynamicValue(_: StaticDataSource): unknown {
      const type = this.nbtFormatReader.readType(_);
      return this.nbtFormatReader[type as NBTTag.Byte](_);
   }
   protected static ReadInterfaceData(_: StaticDataSource): BinarySymbolStruct['isInterfaceData'] {
      const size = BinaryReader.ReadUint8(_);
      const keys: IndexId[] = [];
      const values: IndexId[] = [];
      for (let i = 0; i < size; i++) {
         keys.push(this.ReadIndexRef(_));
         values.push(this.ReadIndexRef(_));
      }
      return { keys, types: values };
   }
   protected static ReadEnumData(_: StaticDataSource): BinarySymbolStruct['isEnumData'] {
      const flags = BinaryReader.ReadUint8(_);
      const length = flags & 0x7f;
      const isNumerical = BitFlags.AllOf(flags, 0x80);
      const keys: IndexId[] = [];
      const values: number[] = [];
      for (let i = 0; i < length; i++) {
         keys.push(this.ReadIndexRef(_));
         if (isNumerical) values.push(BinaryReader.ReadUint16(_));
      }
      return { hasNumericalValues: isNumerical, keys, values };
   }
   protected static ReadExportIndexes(_: StaticDataSource): number[] {
      return BinaryReader.ReadUint16Array(_, BinaryReader.ReadUint16(_));
   }
   protected static ReadMinimalReferences(_: StaticDataSource): IndexId[] {
      return BinaryReader.ReadUint16Array(_, BinaryReader.ReadUint8(_));
   }
   protected static readonly ReadPrivileges = this.ReadMinimalReferences;
   //#endregion
   //#region Writers
   protected static WriteTypes(_: StaticDataSource, types: BinaryTypeStruct[]): void {
      BinaryWriter.WriteUint16(_, types.length);
      for (const type of types) this.WriteType(_, type);
   }

   protected static WriteType(_: StaticDataSource, type: BinaryTypeStruct): void {
      BinaryWriter.WriteUint8(_, type.bitType);

      // Keep Strict Order of the Binary Writer methods

      // If Bind Type Ref
      if (BitFlags.AnyOf(type.bitType, TypeBitFlags.IsBindRef)) {
         this.WriteIndexRef(_, type.bindTypeNameId!);
         if (BitFlags.AnyOf(type.bitType, TypeBitFlags.IsExtended)) {
            this.WriteIndexRef(_, type.fromModuleInfo!.nameId!);
            this.WriteIndexRef(_, type.fromModuleInfo!.version!);
         }
         return;
      }

      // Writing Numbers
      if (AllOf(type.bitType, TypeBitFlags.IsNumber | TypeBitFlags.IsExtended)) {
         BinaryWriter.WriteFloat64(_, type.numberRange!.max);
         BinaryWriter.WriteFloat64(_, type.numberRange!.min);
         return;
      }

      // Type with types
      if (BitFlags.AnyOf(type.bitType, TypeBitFlags.IsExtended)) {
         if (BitFlags.AnyOf(type.bitType, TypeBitFlags.IsComplex)) {
            this.WriteIndexRef(_, type.extendedRefs![0]!);
         } else {
            this.WriteMinimalReferences(_, type.extendedRefs!);
         }
         return;
      }
   }

   protected static WriteSymbols(_: StaticDataSource, symbols: BinarySymbolStruct[]): void {
      BinaryWriter.WriteUint16(_, symbols.length);
      for (const symbol of symbols) this.WriteSymbol(_, symbol);
   }

   protected static WriteSymbol(_: StaticDataSource, symbol: BinarySymbolStruct): void {
      BinaryWriter.WriteUint16(_, symbol.bitFlags);
      this.WriteIndexRef(_, symbol.name);

      if (symbol.bitFlags === 0) return;

      // Strict Order Do not change!!!
      if (AllOf(symbol.bitFlags, SymbolBitFlags.IsEnum)) this.WriteEnumData(_, symbol.isEnumData);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.IsInterface)) this.WriteInterfaceData(_, symbol.isInterfaceData);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.IsInvocable)) this.WritePrivileges(_, symbol.invocablePrivileges!);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.HasSetter)) this.WritePrivileges(_, symbol.setterPrivileges!);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.HasType)) this.WriteIndexRef(_, symbol.hasType!);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.IsBindType)) this.WriteIndexRef(_, symbol.bindType!);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.HasValue)) this.WriteDynamicValue(_, symbol.hasValue);
      if (AllOf(symbol.bitFlags, SymbolBitFlags.IsFunction)) throw new ReferenceError('Params has to be implemented');
   }

   protected static WriteDynamicValue(_: StaticDataSource, value: unknown): void {
      const type = GeneralNBTFormatWriter.determineType(value, NBTTag.Double);
      this.nbtFormatWriter.writeType(_, type);
      this.nbtFormatWriter[type as NBTTag.Byte](_, value as number);
   }

   protected static WriteInterfaceData(_: StaticDataSource, data: BinarySymbolStruct['isInterfaceData']): void {
      BinaryWriter.WriteUint8(_, data!.keys.length);
      for (let i = 0; i < data!.keys.length; i++) {
         this.WriteIndexRef(_, data!.keys[i]!);
         this.WriteIndexRef(_, data!.types[i]!);
      }
   }

   protected static WriteEnumData(_: StaticDataSource, data: BinarySymbolStruct['isEnumData']): void {
      const flags = (data!.hasNumericalValues ? 0x80 : 0x00) | data!.keys.length;
      BinaryWriter.WriteUint8(_, flags);
      for (let i = 0; i < data!.keys.length; i++) {
         this.WriteIndexRef(_, data!.keys[i]!);
         if (data!.hasNumericalValues) BinaryWriter.WriteUint16(_, data!.values![i]!);
      }
   }
   protected static WriteMinimalReferences(_: StaticDataSource, refs: IndexId[]): void {
      BinaryWriter.WriteUint8(_, refs.length);
      BinaryWriter.WriteUint16Array(_, refs);
   }

   protected static readonly WritePrivileges = this.WriteMinimalReferences;

   protected static WriteExportIndexes(_: StaticDataSource, value: ArrayLike<number>) {
      BinaryWriter.WriteUint16(_, value.length);
      BinaryWriter.WriteUint16Array(_, value);
   }
   //#endregion
}
