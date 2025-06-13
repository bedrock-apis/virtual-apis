import { BinaryReader, BinaryWriter } from '../binary';
import { StaticDataSource } from '../binary/static-data-source';
import { ImageModuleData, SerializableSymbol } from '../types';
import { BaseBinaryImageSerializer } from './base-format';

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   public static readonly ReadIndex = BinaryReader.ReadUint16;
   public static override ReadModuleField(_: StaticDataSource): ImageModuleData {
      const symbols = this.ReadSymbols(_);
      const exports = this.ReadExportIndexes(_);
      return { exports };
   }
   public static override WriteModuleField(_: StaticDataSource, m: ImageModuleData): void {
      this.WriteExportIndexes(_, m.exports);
   }
   protected static ReadSymbols(_: StaticDataSource): SerializableSymbol[] {
      const size = BinaryReader.ReadUint16(_);
      const array: SerializableSymbol[] = [];
      for (let i = 0; i < size; i++) array[array.length] = this.ReadSymbol(_);
      return array;
   }
   protected static ReadSymbol(_: StaticDataSource): SerializableSymbol {
      const bitFlags = BinaryReader.ReadUint16(_);
      const name = this.ReadIndex(_);
      if (bitFlags === 0) return { name, bitFlags };
      return null!;
   }

   protected static ReadExportIndexes(_: StaticDataSource): Uint16Array {
      return BinaryReader.ReadUint16Array(_, BinaryReader.ReadUint16(_));
   }
   protected static WriteExportIndexes(_: StaticDataSource, value: ArrayLike<number>) {
      BinaryWriter.WriteUint16(_, value.length);
      BinaryWriter.WriteUint16Array(_, value);
   }
}
