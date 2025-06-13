import { BitFlags } from '@bedrock-apis/common';
import { NBTTag } from '../../ref-bapi-nbt/tag';
import { BinaryReader, BinaryWriter } from '../binary';
import { StaticDataSource } from '../binary/static-data-source';
import { ImageModuleData, IndexId, SerializableSymbol, SymbolBitFlags } from '../types';
import { BaseBinaryImageSerializer } from './base-format';

const { AllOf } = BitFlags;

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   // eslint-disable-next-line @typescript-eslint/naming-convention
   public static readonly ReadIndex = BinaryReader.ReadUint16;
   public static override ReadModuleField(_: StaticDataSource): ImageModuleData {
      const symbols = this.ReadSymbols(_);
      const exports = this.ReadExportIndexes(_);
      return { exports, symbols };
   }
   public static override WriteModuleField(_: StaticDataSource, m: ImageModuleData): void {
      this.WriteExportIndexes(_, m.exports);
   }

   //#region Readers

   protected static ReadSymbols(_: StaticDataSource): SerializableSymbol[] {
      const size = BinaryReader.ReadUint16(_);
      const array: SerializableSymbol[] = [];
      for (let i = 0; i < size; i++) array[array.length] = this.ReadSymbol(_);
      return array;
   }
   protected static ReadSymbol(_: StaticDataSource): SerializableSymbol {
      const bitFlags = BinaryReader.ReadUint16(_);
      const name = this.ReadIndex(_);
      const symbol: SerializableSymbol = { name, bitFlags };

      // -------------------
      // Strict Order
      // -------------------
      if (bitFlags === 0) return symbol;

      // Strict Order Do not change!!!
      if (AllOf(bitFlags, SymbolBitFlags.IsEnum)) symbol.isEnumData = this.ReadEnumData(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsInterface)) symbol.isInterfaceData = this.ReadInterfaceData(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsInvocable)) symbol.invocablePrivileges = this.ReadPrivileges(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasSetter)) symbol.setterPrivileges = this.ReadPrivileges(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasType)) symbol.hasType = this.ReadIndex(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsBindType)) symbol.bindType = this.ReadIndex(_);
      if (AllOf(bitFlags, SymbolBitFlags.HasValue)) symbol.hasValue = this.ReadDynamicValue(_);
      if (AllOf(bitFlags, SymbolBitFlags.IsFunction)) throw new ReferenceError('Params has to be implemented');

      return symbol;
   }
   protected static ReadDynamicValue(_: StaticDataSource): unknown {
      const type = this.nbtFormatReader.readType(_);
      return this.nbtFormatReader[type as NBTTag.Byte](_);
   }
   protected static ReadInterfaceData(_: StaticDataSource): SerializableSymbol['isInterfaceData'] {
      const size = BinaryReader.ReadUint8(_);
      const keys: IndexId[] = [];
      const values: IndexId[] = [];
      for (let i = 0; i < size; i++) {
         keys.push(this.ReadIndex(_));
         values.push(this.ReadIndex(_));
      }
      return { keys, types: values };
   }
   protected static ReadEnumData(_: StaticDataSource): SerializableSymbol['isEnumData'] {
      const flags = BinaryReader.ReadUint8(_);
      const length = flags & 0x7f;
      const isNumerical = BitFlags.AllOf(flags, 0x80);
      const keys: IndexId[] = [];
      const values: number[] = [];
      for (let i = 0; i < length; i++) {
         keys.push(this.ReadIndex(_));
         if (isNumerical) values.push(BinaryReader.ReadUint16(_));
      }
      return { hasNumericalValues: isNumerical, keys, values };
   }
   protected static ReadPrivileges(_: StaticDataSource): IndexId[] {
      return BinaryReader.ReadUint16Array(_, BinaryReader.ReadUint8(_));
   }
   protected static ReadExportIndexes(_: StaticDataSource): number[] {
      return BinaryReader.ReadUint16Array(_, BinaryReader.ReadUint16(_));
   }
   //#endregion
   //#region Writers
   protected static WriteExportIndexes(_: StaticDataSource, value: ArrayLike<number>) {
      BinaryWriter.WriteUint16(_, value.length);
      BinaryWriter.WriteUint16Array(_, value);
   }
   //#endregion
}
