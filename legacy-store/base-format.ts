import { BinaryReader, BinaryWriter } from '@bedrock-apis/binary/src/binary';
import { DataCursorView } from '@bedrock-apis/binary/src/binary/data-cursor-view';
import { IMAGE_GENERAL_DATA_MAGIC, IMAGE_MODULE_HEADER_MAGIC } from '@bedrock-apis/binary/src/constants';
import { GeneralMetadata, ImageHeader, ImageModuleData, ModuleMetadata } from '@bedrock-apis/binary/src/types';
import { BinaryFieldDataType } from '@bedrock-apis/binary/src/types/data-type';
import { NBT_FORMAT_READER, NBT_FORMAT_WRITER, ReaderLike, WriterLike } from '@bedrock-apis/nbt';
import { TagType } from '@bedrock-apis/nbt-core';

const FAKE_CONSTRUCTOR = function () {};
export class BaseBinaryImageSerializer {
   protected constructor() {}
   public static readonly version: number = 0;
   public static readonly isDeprecated: boolean = true;
   public static readonly nbtFormatReader: ReaderLike = NBT_FORMAT_READER;
   public static readonly nbtFormatWriter: WriterLike = NBT_FORMAT_WRITER;
   protected static GetBase<T>(this: T): T | null {
      if (this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
      return null;
   }
   protected static readonly ReadNextMagic = BinaryReader.readUint32;
   protected static readonly WriteNextMagic = BinaryWriter.writeUint32;
   protected static readonly ReadVersion = BinaryReader.readUint16;
   protected static readonly WriteVersion = BinaryWriter.writeUint16;

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
   public static GetGeneralHeader(_: DataCursorView): ImageHeader & { version: number } {
      _.pointer = 0;
      if (this.ReadNextMagic(_) !== IMAGE_GENERAL_DATA_MAGIC)
         throw new TypeError("Malformed data, magic doesn't match");
      const version = this.ReadVersion(_);
      const self = this.GetBinaryImageSerializerFor(version);
      if (!self) throw new ReferenceError('Unsupported format version, ' + version);

      const metadata = this.ReadGeneralMetadata(_);
      const slices = this.ReadGlobalStrings(_);
      return {
         metadata,
         stringSlices: slices,
         version,
         types: [],
         //details: []
      };
   }
   public static *GetAllFields(
      _: DataCursorView,
   ): Generator<{ type: BinaryFieldDataType; metadata: unknown; checkpoint: DataCursorView }> {
      while (_.pointer < _.buffer.length) {
         const magic = this.ReadNextMagic(_);
         if (!(magic in BinaryFieldDataType)) throw new ReferenceError('Unknown magic');

         const metadata = this.ReadFieldMetadata(_);
         const checkpoint = BinaryReader.getCheckPointUint32(_);
         yield { type: magic, metadata, checkpoint };
      }
   }
   public static WriteGeneralHeader(_: DataCursorView, header: ImageHeader & { version: number }) {
      _.pointer = 0;
      console.log(header.version, this.version);
      const self = this.GetBinaryImageSerializerFor(header.version);
      if (!self) throw new ReferenceError('Unsupported format version, ' + header.version);

      self.WriteNextMagic(_, IMAGE_GENERAL_DATA_MAGIC);
      self.WriteVersion(_, header.version);

      console.log(header.metadata);
      self.WriteGeneralMetadata(_, header.metadata);
      self.WriteGlobalStrings(_, header.stringSlices);
   }
   public static WriteFieldHeader(_: DataCursorView, metadata: ModuleMetadata) {
      this.WriteNextMagic(_, IMAGE_MODULE_HEADER_MAGIC);
      this.WriteFieldMetadata(_, metadata);
   }
   //#endregion

   protected static WriteMetadata(_: DataCursorView, metadata: object): void {
      console.log('META', metadata);
      BinaryWriter.writeCheckPointUint16(_, _ => this.nbtFormatWriter[TagType.Compound](_, metadata));
   }
   protected static ReadMetadata(_: DataCursorView): unknown {
      return BinaryReader.readCheckPointUint16(_, _ => this.nbtFormatReader[TagType.Compound](_));
   }

   //!! Has to be getter so the inheritance works properly !!
   protected static get WriteGeneralMetadata() {
      return this.WriteMetadata;
   }
   protected static get WriteFieldMetadata() {
      return this.WriteMetadata;
   }
   protected static get ReadGeneralMetadata() {
      return this.ReadMetadata as (_: DataCursorView) => GeneralMetadata;
   }
   protected static get ReadFieldMetadata() {
      return this.ReadMetadata;
   }
   protected static WriteGlobalStrings(_: DataCursorView, data: string[]) {
      BinaryWriter.writeUint16(_, data.length);
      for (let i = 0; i < data.length; i++) BinaryWriter.writeStringU8(_, data[i] as string);
   }
   protected static ReadGlobalStrings(_: DataCursorView): string[] {
      const array: string[] = [];
      const length = BinaryReader.readUint16(_);
      for (let i = 0; i < length; i++) array.push(BinaryReader.readStringU8(_));
      return array;
   }
   //#region Inheritance
   public static WriteModuleField(_: DataCursorView, module: ImageModuleData) {
      throw new ReferenceError('No implementation error');
   }
   public static ReadModuleField(_: DataCursorView, metadata: unknown): ImageModuleData {
      throw new ReferenceError('No implementation error');
   }
   //#endregion
}
FAKE_CONSTRUCTOR.prototype = BaseBinaryImageSerializer;
