import {
   GeneralNBTFormatReader,
   GeneralNBTFormatWriter,
   NBTFormatReader,
   NBTFormatWriter,
} from '../../ref-bapi-nbt/base';
import { BinaryReader, BinaryWriter } from '../binary';
import { NBTTag } from '../../ref-bapi-nbt/tag';
import { ImageModuleData as ImageModuleData } from '../structs';
import { GeneralMetadata, ImageGeneralHeaderData, ImageModuleHeader, ModuleMetadata } from '../types';
import { StaticDataSource } from '../binary/static-data-source';
import { IMAGE_GENERAL_DATA_MAGIC, IMAGE_MODULE_HEADER_MAGIC } from '../constants';
import { BinaryFieldDataType } from '../types/data-type';

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
   protected static readonly WriteNextMagic = BinaryWriter.WriteUint32;
   protected static readonly ReadVersion = BinaryReader.ReadUint16;
   protected static readonly WriteVersion = BinaryWriter.WriteUint16;

   //#region Public APIs
   public static GetBinaryImageSerializerFor<T extends typeof BaseBinaryImageSerializer>(
      this: T,
      version: number,
   ): T | null {
      if (this.isDeprecated) throw new ReferenceError('Deprecated format, version: ' + this.version);
      if (version > this.version)
         throw new ReferenceError(
            `Future Yet, Unsupported version (${version} vs latest supported ${this.version}), please update virtual-apis package`,
         );
      if (version < this.version) return this.GetBase() ?? null;
      return this;
   }
   public static GetGeneralHeader(_: StaticDataSource): ImageGeneralHeaderData {
      _.pointer = 0;
      if (this.ReadNextMagic(_) !== IMAGE_GENERAL_DATA_MAGIC)
         throw new TypeError("Malformed data, magic doesn't match");
      const version = this.ReadVersion(_);
      const self = this.GetBinaryImageSerializerFor(version);
      if (!self) throw new ReferenceError('Unsupported format version, ' + version);

      const metadata = this.ReadGeneralMetadata(_);
      const slices = this.ReadGlobalStrings(_);
      return { metadata, stringSlices: slices, version };
   }
   public static *GetAllFields(
      _: StaticDataSource,
   ): Generator<{ type: BinaryFieldDataType; metadata: unknown; checkpoint: StaticDataSource }> {
      while (_.pointer < _.uint8Array.length) {
         const magic = this.ReadNextMagic(_);
         if (!(magic in BinaryFieldDataType)) throw new ReferenceError('Unknown magic');

         const metadata = this.ReadFieldMetadata(_);
         const checkpoint = BinaryReader.GetCheckPointUint32(_);
         yield { type: magic, metadata, checkpoint };
      }
   }
   public static WriteGeneralHeader(_: StaticDataSource, header: ImageGeneralHeaderData) {
      _.pointer = 0;
      console.log(header.version, this.version);
      const self = this.GetBinaryImageSerializerFor(header.version);
      if (!self) throw new ReferenceError('Unsupported format version, ' + header.version);

      self.WriteNextMagic(_, IMAGE_GENERAL_DATA_MAGIC);
      self.WriteVersion(_, header.version);

      self.WriteGeneralMetadata(_, header.metadata);
      self.WriteGlobalStrings(_, header.stringSlices);
   }
   public static WriteFieldHeader(_: StaticDataSource, metadata: ModuleMetadata) {
      this.WriteNextMagic(_, IMAGE_MODULE_HEADER_MAGIC);
      this.WriteFieldMetadata(_, metadata);
   }
   //#endregion

   protected static WriteMetadata(_: StaticDataSource, metadata: object): void {
      BinaryWriter.WriteCheckPointUint16(_, _ => this.nbtFormatWriter[NBTTag.Compound](_, metadata));
   }
   protected static ReadMetadata(_: StaticDataSource): unknown {
      return BinaryReader.ReadCheckPointUint16(_, _ => this.nbtFormatReader[NBTTag.Compound](_));
   }

   //!! Has to be getter so the inheritance works properly !!
   protected static get WriteGeneralMetadata() {
      return this.WriteMetadata;
   }
   protected static get WriteFieldMetadata() {
      return this.WriteMetadata;
   }
   protected static get ReadGeneralMetadata() {
      return this.ReadMetadata as (_: StaticDataSource) => GeneralMetadata;
   }
   protected static get ReadFieldMetadata() {
      return this.ReadMetadata;
   }
   protected static WriteGlobalStrings(_: StaticDataSource, data: string[]) {
      BinaryWriter.WriteUint16(_, data.length);
      for (let i = 0; i < data.length; i++) BinaryWriter.WriteStringU8(_, data[i] as string);
   }
   protected static ReadGlobalStrings(_: StaticDataSource): string[] {
      const array: string[] = [];
      const length = BinaryReader.ReadUint16(_);
      for (let i = 0; i < length; i++) array.push(BinaryReader.ReadStringU8(_));
      return array;
   }
   //#region Inheritance
   public static WriteModuleField(_: StaticDataSource, module: ImageModuleData) {
      throw new ReferenceError('No implementation error');
   }
   public static ReadModuleField(_: StaticDataSource, metadata: unknown): ImageModuleData {
      throw new ReferenceError('No implementation error');
   }
   //#endregion
}
FAKE_CONSTRUCTOR.prototype = BaseBinaryImageSerializer;
