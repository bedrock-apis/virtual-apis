import { IStaticDataProvider } from '../../ref-bapi-nbt/base';
import { ImageModuleData } from '../structs';
import { BaseBinaryImageSerializer } from './base-format';

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   protected static override ReadModule(_: IStaticDataProvider): ImageModuleData {
      const meta = super.ReadMetadata(_);
      return this.ReadContainer(_, meta as object);
   }
   protected static GetMetadata(m: ImageModuleData): object {
      return Object.create(null);
   }
   protected static override WriteModule(_: IStaticDataProvider, m: ImageModuleData): void {
      this.WriteMetadata(_, this.GetMetadata(m));
   }
   protected static ReadContainer(_: IStaticDataProvider, metadata: object): ImageModuleData {
      return null as unknown as ImageModuleData;
   }
}
