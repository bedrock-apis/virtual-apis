import { GeneralNBTFormatReader, GeneralNBTFormatWriter, IStaticDataProvider, NBTFormatReader, NBTFormatWriter } from "../../ref-bapi-nbt/base";
import { BinaryReader, BinaryWriter } from "../binary";
import { NBTTag } from "../../ref-bapi-nbt/tag";

export class BaseImageModuleFormat {
    protected constructor(){}
    public static readonly MAGIC = 0x696d6176; //'vami' -> in Litte Endian -> VA Module Image
    public static readonly version = NaN;
    public static readonly HEADER_SIZE = 4 + 2 + 4;
    public static readonly NBT_FORMAT_READER: NBTFormatReader = new GeneralNBTFormatReader;
    public static readonly NBT_FORMAT_WRITER: NBTFormatWriter = new GeneralNBTFormatWriter;
    public static readheader(_: IStaticDataProvider): {version: number, size: number}{
        if(BinaryReader.readUint32(_) !== this.MAGIC)
            throw new SyntaxError("Module has to start with binary magic prefix");

        const version = BinaryReader.readUint16(_);
        const size = BinaryReader.readUint32(_);
        return {version, size};
    }
    public static writeHeader(_: IStaticDataProvider, size: number): void{
        BinaryWriter.writeUint32(_, this.MAGIC);
        if(!isFinite(this.version))
            throw new ReferenceError("Version not specified");
        BinaryWriter.writeUint16(_, this.version);
        BinaryWriter.writeUint32(_, size);
    }
    public static writeMetadata(_: IStaticDataProvider, metadata: object): void{
        this.NBT_FORMAT_WRITER[NBTTag.Compound](_, metadata);
    }
    public static readMetadata<T>(_: IStaticDataProvider): T {
        return this.NBT_FORMAT_READER[NBTTag.Compound](_) as T;
    }
}