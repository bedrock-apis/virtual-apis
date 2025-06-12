import { StaticDataSource } from '../binary/static-data-source';
import { ImageModuleData } from '../structs';
import { BaseBinaryImageSerializer } from './base-format';

export class BinaryImageSerializerV1 extends BaseBinaryImageSerializer {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   protected static override ReadModuleField(_: StaticDataSource): ImageModuleData {
      return null as unknown as ImageModuleData;
   }
   protected static override WriteModuleField(_: StaticDataSource, m: ImageModuleData): void {}
}
