import { BinaryReader, BinaryWriter } from '../binary';
import { StaticDataSource } from '../binary/static-data-source';
import { ImageModuleData } from '../structs';
import { BaseBinaryImageSerializer } from './base-format';

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   public static override ReadModuleField(_: StaticDataSource): ImageModuleData {
      const exports = this.ReadExportIndexes(_);
      return { exports };
   }
   public static override WriteModuleField(_: StaticDataSource, m: ImageModuleData): void {
      this.WriteExportIndexes(_, m.exports);
   }

   protected static ReadExportIndexes(_: StaticDataSource): Uint16Array {
      const length = BinaryReader.ReadUint16(_);
      return BinaryReader.ReadUint16Array(_, length);
   }
   protected static WriteExportIndexes(_: StaticDataSource, value: Uint16Array) {
      BinaryWriter.WriteUint16(_, value.length);
      BinaryWriter.WriteUint16Array(_, value);
   }
}
