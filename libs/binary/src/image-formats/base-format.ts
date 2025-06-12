import {
   GeneralNBTFormatReader,
   GeneralNBTFormatWriter,
   IStaticDataProvider,
   NBTFormatReader,
   NBTFormatWriter,
} from '../../ref-bapi-nbt/base';
import { BinaryReader, BinaryWriter } from '../binary';
import { NBTTag } from '../../ref-bapi-nbt/tag';
import { ImageModule } from '../structs';

const FAKE_CONSTRUCTOR = function () {};
export class BaseImageModuleFormat {
   protected constructor() {}
   public static readonly magic = 0x696d6176; //'vami' -> in Litte Endian -> VA Module Image
   public static readonly version: number = 0;
   public static readonly isDeprecated: boolean = true;
   public static readonly nbtFormatReader: NBTFormatReader = new GeneralNBTFormatReader();
   public static readonly nbtFormatWriter: NBTFormatWriter = new GeneralNBTFormatWriter();

   protected static GetBase<T>(this: T): T | null {
      if (this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
      return null;
   }
   //#region Header
   public static readonly headerSize = 4 + 2 + 4;
   public static ReadHeader(_: IStaticDataProvider): { version: number; size: number } {
      if (BinaryReader.ReadUint32(_) !== this.magic)
         throw new SyntaxError('Module has to start with binary magic prefix');

      const version = BinaryReader.ReadUint16(_);
      const size = BinaryReader.ReadUint32(_);
      return { version, size };
   }
   public static WriteHeader(_: IStaticDataProvider, size: number): void {
      BinaryWriter.WriteUint8(_, this.magic);
      if (!isFinite(this.version)) throw new ReferenceError('Version not specified');
      BinaryWriter.WriteUint16(_, this.version);
      BinaryWriter.WriteUint8(_, size);
   }
   //#endregion

   //#region Meta
   public static WriteMetadata(_: IStaticDataProvider, metadata: object): void {
      this.nbtFormatWriter[NBTTag.Compound](_, metadata);
   }
   public static ReadMetadata<T>(_: IStaticDataProvider): T {
      return this.nbtFormatReader[NBTTag.Compound](_) as T;
   }
   //#endregion
   private static ReadInternal(_: IStaticDataProvider, version: number): ImageModule | null {
      if (this.isDeprecated) throw new ReferenceError('Deprecated format, version: ' + this.version);
      if (version > this.version)
         throw new ReferenceError('Future Yet, Unsupported version, please update virtual-apis package');
      if (version < this.version)
         return (
            (
               this.GetBase() as unknown as { ReadInternal: (_: IStaticDataProvider, v: number) => ImageModule }
            )?.ReadInternal(_, version) ?? null
         );
      return this.ReadModule(_);
   }
   //#region Module
   protected static ReadModule(_: IStaticDataProvider): ImageModule {
      throw new ReferenceError('Missing implementation, version: ' + this.version);
   }
   protected static WriteModule(_: IStaticDataProvider, m: ImageModule) {
      throw new ReferenceError('Missing implementation, version: ' + this.version);
   }
   //#endregion

   public static Read(_: IStaticDataProvider): ImageModule {
      const header = this.ReadHeader(_);
      const m = this.ReadInternal(_, header.version);
      if (!m) throw new ReferenceError('Failed to read image module, version: ' + header.version);

      return m;
   }
   public static Write(_: IStaticDataProvider, m: ImageModule): void {
      _.pointer = this.headerSize; // Skip header

      // Write module
      this.WriteModule(_, m);

      // Write header with righ module size
      const size = _.pointer - this.headerSize;
      _.pointer = 0;
      this.WriteHeader(_, size);

      // Correct full length
      _.pointer = size + this.headerSize;
   }
}
FAKE_CONSTRUCTOR.prototype = BaseImageModuleFormat;
