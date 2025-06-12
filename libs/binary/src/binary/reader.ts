import { IStaticDataProvider } from '../../ref-bapi-nbt/base';

const utf8Decoder = new TextDecoder();

// Use LE always
export class BinaryReader {
   public static ReadUint8(dataProvider: IStaticDataProvider): number {
      return dataProvider.view.getUint8(dataProvider.pointer++);
   }

   public static ReadUint16(dataProvider: IStaticDataProvider): number {
      const value = dataProvider.view.getUint16(dataProvider.pointer, true);
      dataProvider.pointer += 2;
      return value;
   }

   // Memory efficient but not as fast, has to be benchamarked on real-world samples
   public static ReadVarUint32(dataProvider: IStaticDataProvider): number {
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

   public static ReadUint32(dataProvider: IStaticDataProvider): number {
      const value = dataProvider.view.getUint32(dataProvider.pointer, true);
      dataProvider.pointer += 4;
      return value;
   }

   public static ReadBuffer(dataProvider: IStaticDataProvider, length: number): Uint8Array {
      return dataProvider.uint8Array.subarray(dataProvider.pointer, (dataProvider.pointer += length));
   }

   public static ReadStringWith(
      lengthReader: (d: IStaticDataProvider) => number,
      decoder = utf8Decoder,
      dataProvider: IStaticDataProvider,
   ): string {
      const length = lengthReader(dataProvider);
      const buffer = BinaryReader.ReadBuffer(dataProvider, length);
      return decoder.decode(buffer);
   }

   public static ReadStringU8: (dataProvider: IStaticDataProvider) => string = BinaryReader.ReadStringWith.bind(
      null,
      BinaryReader.ReadUint8,
      utf8Decoder,
   );
   public static ReadStringU16: (dataProvider: IStaticDataProvider) => string = BinaryReader.ReadStringWith.bind(
      null,
      BinaryReader.ReadUint16,
      utf8Decoder,
   );
   public static ReadStringU32: (dataProvider: IStaticDataProvider) => string = BinaryReader.ReadStringWith.bind(
      null,
      BinaryReader.ReadUint32,
      utf8Decoder,
   );

   public static ReadArrayBufferU16(dataProvider: IStaticDataProvider): Uint8Array {
      const length = BinaryReader.ReadUint16(dataProvider);
      return BinaryReader.ReadBuffer(dataProvider, length);
   }

   public static ReadArrayBufferU32(dataProvider: IStaticDataProvider): Uint8Array {
      const length = BinaryReader.ReadUint32(dataProvider);
      return BinaryReader.ReadBuffer(dataProvider, length);
   }
}
