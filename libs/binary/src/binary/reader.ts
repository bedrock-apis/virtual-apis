import { IStaticDataProvider } from "../../ref-bapi-nbt/base";

const utf8Decoder = new TextDecoder();

// Use LE always
export class BinaryReader {
    public static readUint8(dataProvider: IStaticDataProvider): number {
        return dataProvider.view.getUint8(dataProvider.pointer++);
    }

    public static readUint16(dataProvider: IStaticDataProvider): number {
        const value = dataProvider.view.getUint16(dataProvider.pointer, true);
        dataProvider.pointer += 2;
        return value;
    }

    public static readUint32(dataProvider: IStaticDataProvider): number {
        const value = dataProvider.view.getUint32(dataProvider.pointer, true);
        dataProvider.pointer += 4;
        return value;
    }

    public static readBuffer(dataProvider: IStaticDataProvider, length: number): Uint8Array {
        return dataProvider.uint8Array.subarray(dataProvider.pointer, dataProvider.pointer += length);
    }

    public static readStringWith(lengthReader: (d: IStaticDataProvider) => number, decoder = utf8Decoder, dataProvider: IStaticDataProvider): string {
        const length = lengthReader(dataProvider);
        const buffer = BinaryReader.readBuffer(dataProvider, length);
        return decoder.decode(buffer);
    }

    public static readStringU8: (dataProvider: IStaticDataProvider) => string = BinaryReader.readStringWith.bind(null, BinaryReader.readUint8, utf8Decoder);
    public static readStringU16: (dataProvider: IStaticDataProvider) => string = BinaryReader.readStringWith.bind(null, BinaryReader.readUint16, utf8Decoder);
    public static readStringU32: (dataProvider: IStaticDataProvider) => string = BinaryReader.readStringWith.bind(null, BinaryReader.readUint32, utf8Decoder);

    public static readArrayBufferU16(dataProvider: IStaticDataProvider): Uint8Array {
        const length = BinaryReader.readUint16(dataProvider);
        return BinaryReader.readBuffer(dataProvider, length);
    }

    public static readArrayBufferU32(dataProvider: IStaticDataProvider): Uint8Array {
        const length = BinaryReader.readUint32(dataProvider);
        return BinaryReader.readBuffer(dataProvider, length);
    }
}
