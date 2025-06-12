import { IStaticDataProvider } from '../../ref-bapi-nbt/base';
import { ImageModule } from '../structs';
import { BaseImageModuleFormat } from './base-format';

export class ImageModuleFormatV1 extends BaseImageModuleFormat {
   public static override readonly isDeprecated = false;
   // Version should be hardcoded and don't change (super.version + 1;) is bad practice
   public static override readonly version: number = 1;
   protected static override ReadModule(_: IStaticDataProvider): ImageModule {
      const meta = super.ReadMetadata(_);
      return this.ReadContainer(_, meta as object);
   }
   protected static GetMetadata(m: ImageModule): object {
      return Object.create(null);
   }
   protected static override WriteModule(_: IStaticDataProvider, m: ImageModule): void {
      this.WriteMetadata(_, this.GetMetadata(m));
   }
   protected static ReadContainer(_: IStaticDataProvider, metadata: object): ImageModule {
      return null as unknown as ImageModule;
   }
}
