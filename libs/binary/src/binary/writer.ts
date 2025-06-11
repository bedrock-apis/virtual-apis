import { IStaticDataProvider } from "../../ref-bapi-nbt/base";

const utf8Encoder = new TextEncoder();


// Use LE alwayes
export class BinaryWriter {
    public static writeUint8(dataProvider: IStaticDataProvider, value: number): void{ dataProvider.view.setUint8(dataProvider.pointer++, value); }
    public static writeUint16(dataProvider: IStaticDataProvider, value: number): void{
        dataProvider.view.setUint16(dataProvider.pointer, value, true); 
        dataProvider.pointer+=2;
    }
    public static writeUint32(dataProvider: IStaticDataProvider, value: number): void{
        dataProvider.view.setUint32(dataProvider.pointer, value, true); 
        dataProvider.pointer+=2;
    }
    public static writeBuffer(dataProvider: IStaticDataProvider, value: Uint8Array): void{
        dataProvider.uint8Array.set(value, dataProvider.pointer);
        dataProvider.pointer+=value.length;
    }
    public static writeStringWith(lengthWriter: (d: IStaticDataProvider, v: number)=>void, encoder = utf8Encoder, dataProvider: IStaticDataProvider, value: string){
        const buffer = encoder.encode(value);
        lengthWriter(dataProvider, buffer.length);
        BinaryWriter.writeBuffer(dataProvider, buffer);
    }
    public static writeStringU8: (dataProvider: IStaticDataProvider, value: string) => void = BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint8, utf8Encoder);
    public static writeStringU16: (dataProvider: IStaticDataProvider, value: string) => void = BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint16, utf8Encoder);
    public static writeStringU32: (dataProvider: IStaticDataProvider, value: string) => void = BinaryWriter.writeStringWith.bind(null, BinaryWriter.writeUint32, utf8Encoder);
    public static writeArrayBufferU16(dataProvider: IStaticDataProvider, value: Uint8Array): void{
        BinaryWriter.writeUint16(dataProvider, value.length);
        dataProvider.uint8Array.set(value, dataProvider.pointer);
        dataProvider.pointer+=value.length;
    }
    public static writeArrayBufferU32(dataProvider: IStaticDataProvider, value: Uint8Array): void{
        BinaryWriter.writeUint16(dataProvider, value.length);
        dataProvider.uint8Array.set(value, dataProvider.pointer);
        dataProvider.pointer+=value.length;
    }
}