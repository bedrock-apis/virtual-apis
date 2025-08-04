import { NBT_FORMAT_READER, NBT_FORMAT_WRITER, ReaderLike, WriterLike } from '@bedrock-apis/nbt';
import { TagType } from '@bedrock-apis/nbt-core';
import { MetadataToSerializableTransformer } from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { BinaryIOWriter, BinaryReader, BinaryWriter } from '../binary';
import { DataCursorView } from '../binary/data-cursor-view';
import { BinaryIO } from '../binary/io';
import { IMAGE_GENERAL_DATA_MAGIC, IMAGE_MODULE_HEADER_MAGIC } from '../constants';
import { GeneralMetadata, ImageGeneralHeaderData, ImageModuleData, ModuleMetadata } from '../types';
import { BinaryFieldDataType } from '../types/data-type';

const FAKE_CONSTRUCTOR = function () {};
export class BaseBinaryImageSerializer {
   protected constructor() {}
   public static current = BaseBinaryImageSerializer;
   public static readonly version: number = 0;
   public static readonly isDeprecated: boolean = true;
   public static readonly nbtFormatReader: ReaderLike = NBT_FORMAT_READER;
   public static readonly nbtFormatWriter: WriterLike = NBT_FORMAT_WRITER;
   protected static GetBase<T>(this: T): T | null {
      if (this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
      return null;
   }
   protected static readonly ReadNextMagic = BinaryReader.ReadUint32;
   protected static readonly WriteNextMagic = BinaryWriter.WriteUint32;
   protected static readonly ReadVersion = BinaryReader.ReadUint16;
   protected static readonly WriteVersion = BinaryWriter.WriteUint16;

   public static Write(data: Awaited<ReturnType<MetadataToSerializableTransformer['transform']>>) {
      const buffer = DataCursorView.Alloc(2 ** 16 * 3); // 196608 bytes -> 192 kb
      const format = BaseBinaryImageSerializer.current;
      console.log(format.version);
      const io = new BinaryIOWriter(buffer, data) as unknown as BinaryIO<
         Awaited<ReturnType<MetadataToSerializableTransformer['transform']>>
      >;
      // TODO Move above type to the interface and figure out why it doesn't work here
      // @ts-expect-error TODO above
      format.GeneralHeader(io.sub('metadata'));

      // TODO use io.array
      for (const { metadata, id, data, stats } of io.storage.modules) {
         const size = buffer.pointer;
         console.log(`Write Module ${id}`, stats.uniqueTypes);
         format.WriteFieldHeader(buffer, metadata);
         format.WriteModuleField(buffer, data);
         console.log(`Module '${id}', size: ${buffer.pointer - size}`);
      }
   }

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
   public static GetGeneralHeader(_: DataCursorView): ImageGeneralHeaderData {
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
      _: DataCursorView,
   ): Generator<{ type: BinaryFieldDataType; metadata: unknown; checkpoint: DataCursorView }> {
      while (_.pointer < _.buffer.length) {
         const magic = this.ReadNextMagic(_);
         if (!(magic in BinaryFieldDataType)) throw new ReferenceError('Unknown magic');

         const metadata = this.ReadFieldMetadata(_);
         const checkpoint = BinaryReader.GetCheckPointUint32(_);
         yield { type: magic, metadata, checkpoint };
      }
   }

   public static GeneralHeader(io: BinaryIO<ImageGeneralHeaderData>) {
      console.log(io.storage.version, this.version);
      const self = this.GetBinaryImageSerializerFor(io.storage.version);
      if (!self) throw new ReferenceError('Unsupported format version, ' + io.storage.version);

      io.external({ magic: IMAGE_GENERAL_DATA_MAGIC }).uint32('magic');
      io.uint32('version');

      console.log(io.storage.metadata);
      self.Metadata(io);
      io.string8Array16('stringSlices');
   }
   public static WriteGeneralHeader(_: DataCursorView, header: ImageGeneralHeaderData) {
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

   protected static Metadata(io: BinaryIO<ImageGeneralHeaderData>): unknown {
      return io.checkPoint16(
         _ => this.nbtFormatWriter[TagType.Compound](_, io.storage.metadata),
         _ =>
            ((io.storage as { metadata: ImageGeneralHeaderData['metadata'] }).metadata =
               this.nbtFormatReader[TagType.Compound](_)),
      );
   }
   protected static WriteMetadata(_: DataCursorView, metadata: object): void {
      console.log('META', metadata);
      BinaryWriter.WriteCheckPointUint16(_, _ => this.nbtFormatWriter[TagType.Compound](_, metadata));
   }
   protected static ReadMetadata(_: DataCursorView): unknown {
      return BinaryReader.ReadCheckPointUint16(_, _ => this.nbtFormatReader[TagType.Compound](_));
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
      BinaryWriter.WriteUint16(_, data.length);
      for (let i = 0; i < data.length; i++) BinaryWriter.WriteStringU8(_, data[i] as string);
   }
   protected static ReadGlobalStrings(_: DataCursorView): string[] {
      const array: string[] = [];
      const length = BinaryReader.ReadUint16(_);
      for (let i = 0; i < length; i++) array.push(BinaryReader.ReadStringU8(_));
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
