import { StaticDataSource } from './static-data-source';

const utf8Decoder = new TextDecoder();

// Use LE always
export class BinaryReader {
   public static GetCheckPointUint16(_: StaticDataSource): StaticDataSource {
      const size = BinaryReader.ReadUint16(_);
      return _.peek(size);
   }
   public static GetCheckPointUint32(_: StaticDataSource): StaticDataSource {
      const size = BinaryReader.ReadUint16(_);
      _.pointer += size;
      return _.peek(size);
   }
   public static ReadCheckPointUint16<T>(_: StaticDataSource, reader: (_: StaticDataSource) => T): T {
      const size = BinaryReader.ReadUint16(_);
      return reader(_.peek(size));
   }
   public static ReadCheckPointUint32<T>(_: StaticDataSource, reader: (_: StaticDataSource) => T): T {
      const size = BinaryReader.ReadUint32(_);
      return reader(_.peek(size));
   }
   public static ReadUint8(dataProvider: StaticDataSource): number {
      return dataProvider.view.getUint8(dataProvider.pointer++);
   }

   public static ReadUint16(dataProvider: StaticDataSource): number {
      const value = dataProvider.view.getUint16(dataProvider.pointer, true);
      dataProvider.pointer += 2;
      return value;
   }

   // Memory efficient but not as fast, has to be benchamarked on real-world samples
   public static ReadVarUint32(dataProvider: StaticDataSource): number {
      let current = dataProvider.uint8Array[dataProvider.pointer++] ?? 0;
      let value = current;
      let shift = 0;
      let i = 0;
      while (value & 0x80 && i++ < 5) {
         current = dataProvider.uint8Array[dataProvider.pointer++] ?? 0;
         value |= (current & 0x7f) << (shift += 7);
      }
      return value;
   }

   public static ReadUint32(dataProvider: StaticDataSource): number {
      const value = dataProvider.view.getUint32(dataProvider.pointer, true);
      dataProvider.pointer += 4;
      return value;
   }

   public static ReadBuffer(dataProvider: StaticDataSource, length: number): Uint8Array {
      return dataProvider.uint8Array.subarray(dataProvider.pointer, (dataProvider.pointer += length));
   }

   public static ReadStringWith(
      lengthReader: (d: StaticDataSource) => number,
      decoder = utf8Decoder,
      dataProvider: StaticDataSource,
   ): string {
      const length = lengthReader(dataProvider);
      const buffer = BinaryReader.ReadBuffer(dataProvider, length);
      return decoder.decode(buffer);
   }

   public static ReadStringU8: (dataProvider: StaticDataSource) => string = BinaryReader.ReadStringWith.bind(
      BinaryReader,
      BinaryReader.ReadUint8,
      utf8Decoder,
   );
   public static ReadStringU16: (dataProvider: StaticDataSource) => string = BinaryReader.ReadStringWith.bind(
      BinaryReader,
      BinaryReader.ReadUint16,
      utf8Decoder,
   );
   public static ReadStringU32: (dataProvider: StaticDataSource) => string = BinaryReader.ReadStringWith.bind(
      BinaryReader,
      BinaryReader.ReadUint32,
      utf8Decoder,
   );

   public static ReadArrayBufferU16(dataProvider: StaticDataSource): Uint8Array {
      const length = BinaryReader.ReadUint16(dataProvider);
      return BinaryReader.ReadBuffer(dataProvider, length);
   }

   public static ReadArrayBufferU32(dataProvider: StaticDataSource): Uint8Array {
      const length = BinaryReader.ReadUint32(dataProvider);
      return BinaryReader.ReadBuffer(dataProvider, length);
   }
   public static ReadUint16Array(_: StaticDataSource, length: number): number[] {
      const view = _.view;
      const buffer = [];
      let offset = _.pointer;
      for (let i = 0; i < length; i++, offset += 2) buffer[i] = view.getUint16(offset, true);
      _.pointer += offset;
      return buffer;
   }
}
