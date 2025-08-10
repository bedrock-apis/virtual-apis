import { SerializableMetadata } from '@bedrock-apis/va-image-generator/src/binary/metadata-to-serializable';
import { BinaryIOReader, SafeBinaryIOWriter } from '../binary';
import { DataCursorView } from '../binary/data-cursor-view';
import { BinaryIO } from '../binary/io';
import { IMAGE_GENERAL_DATA_MAGIC } from '../constants';

const FAKE_CONSTRUCTOR = function () {};
export class BaseBinaryIOImageSerializer {
   protected constructor() {}
   public static current = BaseBinaryIOImageSerializer;
   public static readonly version: number = 0;
   public static readonly isDeprecated: boolean = true;
   protected static getBase<T>(this: T): T | null {
      if (this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
      return null;
   }

   public static write(data: SerializableMetadata) {
      const buffer = DataCursorView.alloc(2 ** 16 * 10); // 196608 bytes -> 192 kb
      const format = BaseBinaryIOImageSerializer.current;
      data.version = format.version;

      const io = new SafeBinaryIOWriter(buffer, data as object) as unknown as BinaryIO<SerializableMetadata>;
      format.baseMarshal(io);

      return io.data.getBuffer();
   }

   public static read(source: Uint8Array<ArrayBufferLike>) {
      const buffer = new DataCursorView(source);
      buffer.pointer = 0;
      const format = BaseBinaryIOImageSerializer.current;
      const io = new BinaryIOReader(buffer, {}) as unknown as BinaryIO<SerializableMetadata>;
      format.baseMarshal(io);
      return io.storage;
   }

   private static getBinaryImageSerializerFor<T extends typeof BaseBinaryIOImageSerializer>(
      this: T,
      version: number,
   ): T | null {
      if (this.isDeprecated) throw new ReferenceError('Deprecated format, version: ' + this.version);
      if (version > this.version)
         throw new ReferenceError(
            `Future Yet, Unsupported version (${version} vs latest supported ${this.version}), please update virtual-apis package`,
         );
      if (version < this.version) return this.getBase() ?? null;
      return this;
   }

   private static baseMarshal(io: BinaryIO<SerializableMetadata>) {
      io.magic(IMAGE_GENERAL_DATA_MAGIC);
      io.uint32('version');

      const format = this.getBinaryImageSerializerFor(io.storage.version ?? -1);
      if (!format) {
         throw new ReferenceError(`Unsupported format version ${io.storage.version}. Latest ${this.current.version}`);
      }

      format.marshal(io);
   }

   protected static marshal(io: BinaryIO<SerializableMetadata>) {
      throw new Error('Not implemented, use base class');
   }
}
FAKE_CONSTRUCTOR.prototype = BaseBinaryIOImageSerializer;
