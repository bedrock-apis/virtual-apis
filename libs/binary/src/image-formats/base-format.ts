import {
   GeneralNBTFormatReader,
   GeneralNBTFormatWriter,
   IStaticDataProvider,
   NBTFormatReader,
   NBTFormatWriter,
} from '../../ref-bapi-nbt/base';
import { BinaryReader, BinaryWriter } from '../binary';
import { NBTTag } from '../../ref-bapi-nbt/tag';
import { ImageModuleData as ImageModuleData } from '../structs';
import { ImageModuleHeader, ModuleMetadata } from '../types';
import { IMAGE_MODULE_HEADER_MAGIC } from '../constants';

const FAKE_CONSTRUCTOR = function () {};
export class BaseBinaryImageSerializer {
   protected constructor() {}
   public static readonly version: number = 0;
   public static readonly isDeprecated: boolean = true;
   public static readonly nbtFormatReader: NBTFormatReader = new GeneralNBTFormatReader();
   public static readonly nbtFormatWriter: NBTFormatWriter = new GeneralNBTFormatWriter();
   protected static GetBase<T>(this: T): T | null {
      if (this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
      return null;
   }
   protected static readonly ReadNextMagic = BinaryReader.ReadUint32;

   //#region Public APIs
   public static GetBinaryImageSerializerFor<T extends typeof BaseBinaryImageSerializer>(
      this: T,
      version: number,
   ): T | null {
      if (this.isDeprecated) throw new ReferenceError('Deprecated format, version: ' + this.version);
      if (version > this.version)
         throw new ReferenceError('Future Yet, Unsupported version, please update virtual-apis package');
      if (version < this.version) return this.GetBase() ?? null;
      return this;
   }
   public static *GetAllModuleHeaders(
      _: IStaticDataProvider,
   ): Generator<{ header: ImageModuleHeader; checkpoint: IStaticDataProvider }> {
      while (_.pointer < _.uint8Array.length) {
         const header = this.ReadModuleHeaderWithSize(_);
         const checkpoint = BinaryReader.GetCheckPointUint32(_);
         yield { header, checkpoint };
      }
   }
   public static ReadModuleData(_: IStaticDataProvider, metadata: ModuleMetadata) {
      throw new ReferenceError('No implementation');
   }
   //#endregion

   //#region Internal APIs
   protected static ReadModuleHeaderWithSize(_: IStaticDataProvider): ImageModuleHeader {
      if (this.ReadNextMagic(_) !== IMAGE_MODULE_HEADER_MAGIC)
         throw new SyntaxError('Module has to start with binary magic prefix');

      const version = BinaryReader.ReadUint16(_);
      const metadata = BinaryReader.ReadCheckPointUint16(_, _ => this.ReadMetadata(_));
      const size = BinaryReader.ReadUint32(_);
      // go back to check point
      _.pointer -= 4;
      return { version, size, metadata };
   }
   protected static WriteModuleHeader(_: IStaticDataProvider, header: ImageModuleHeader): void {
      BinaryWriter.WriteUint8(_, IMAGE_MODULE_HEADER_MAGIC);
      if (!isFinite(this.version)) throw new ReferenceError('Version not specified');
      BinaryWriter.WriteUint16(_, this.version);
      BinaryWriter.WriteCheckPointUint16(_, _ => this.WriteMetadata(_, header.metadata));
   }
   //#endregion

   //#region Meta
   protected static WriteMetadata(_: IStaticDataProvider, metadata: ModuleMetadata): void {
      this.nbtFormatWriter[NBTTag.Compound](_, metadata);
   }
   protected static ReadMetadata(_: IStaticDataProvider): ModuleMetadata {
      return this.nbtFormatReader[NBTTag.Compound](_);
   }
   //#endregion
   private static ReadInternal(_: IStaticDataProvider, version: number): ImageModuleData | null {
      if (this.isDeprecated) throw new ReferenceError('Deprecated format, version: ' + this.version);
      if (version > this.version)
         throw new ReferenceError('Future Yet, Unsupported version, please update virtual-apis package');
      if (version < this.version) return this.GetBase()?.ReadInternal(_, version) ?? null;

      return this.ReadModule(_);
   }
   //#region Module
   protected static ReadModule(_: IStaticDataProvider): ImageModuleData {
      throw new ReferenceError('Missing implementation, version: ' + this.version);
   }
   protected static WriteModule(_: IStaticDataProvider, m: ImageModuleData) {
      throw new ReferenceError('Missing implementation, version: ' + this.version);
   }
   //#endregion

   public static Read(_: IStaticDataProvider): ImageModuleData {
      const header = this.ReadModuleHeaderWithSize(_);
      const m = BinaryReader.ReadCheckPointUint32(_, _ => this.ReadInternal(_, header.version));
      if (!m) throw new ReferenceError('Failed to read image module, version: ' + header.version);

      return m;
   }
   public static Write(_: IStaticDataProvider, m: ImageModuleData, meta: ModuleMetadata): void {
      this.WriteModuleHeader(_, { metadata: meta, version: this.version });
      BinaryWriter.WriteCheckPointUint32(_, _ => this.WriteModule(_, m));
   }
}
FAKE_CONSTRUCTOR.prototype = BaseBinaryImageSerializer;
