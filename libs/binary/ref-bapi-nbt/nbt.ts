import { StaticDataProvider } from './base/data-provider';
import { NBTFormatReader, NBTFormatWriter } from './base/format';
import { NBTTag } from './tag';

export class StaticNBT {
   public constructor(
      public readonly reader: NBTFormatReader,
      public readonly writer: NBTFormatWriter,
   ) {}
   public readProperty<T>(dataProvider: StaticDataProvider): { type: NBTTag; key: string; value: T | null } {
      const type = this.reader.readType(dataProvider);
      const key = this.reader[NBTTag.String](dataProvider);
      if (type === NBTTag.EndOfCompound) return { type, key, value: null };
      const value = this.reader[type](dataProvider);
      return { type, key, value: value as T };
   }
   public readValueExplicit<T>(dataProvider: StaticDataProvider, tag: NBTTag): T {
      return this.reader[tag as NBTTag.Byte](dataProvider) as T;
   }
   public readValue<T>(dataProvider: StaticDataProvider): T | null {
      const type = this.reader.readType(dataProvider);
      if (type === NBTTag.EndOfCompound) return null;
      return this.reader[type](dataProvider) as T;
   }
}
