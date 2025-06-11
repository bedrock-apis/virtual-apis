import { GeneralNBTFormatReader, GeneralNBTFormatWriter, IStaticDataProvider, NBTFormatReader, NBTFormatWriter } from "../../ref-bapi-nbt/base";
import { BinaryReader, BinaryWriter } from "../binary";
import { NBTTag } from "../../ref-bapi-nbt/tag";

const FAKE_CONSTRUCTOR = function(){};
export class BaseImageModuleFormat {
    protected constructor(){}
    public static readonly MAGIC = 0x696d6176; //'vami' -> in Litte Endian -> VA Module Image
    public static readonly version: number = 0;
    public static readonly isDeprecated: boolean = true;
    public static readonly NBT_FORMAT_READER: NBTFormatReader = new GeneralNBTFormatReader;
    public static readonly NBT_FORMAT_WRITER: NBTFormatWriter = new GeneralNBTFormatWriter;

    public static getBase<T>(this: T): T | null{
        if(this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this as any) as T;
        return null;
    }
    //#region Header
    public static readonly HEADER_SIZE = 4 + 2 + 4;
    public static readHeader(_: IStaticDataProvider): {version: number, size: number}{
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
    //#endregion

    //#region Meta
    public static writeMetadata(_: IStaticDataProvider, metadata: object): void{
        this.NBT_FORMAT_WRITER[NBTTag.Compound](_, metadata);
    }
    public static readMetadata<T>(_: IStaticDataProvider): T {
        return this.NBT_FORMAT_READER[NBTTag.Compound](_) as T;
    }
    //#endregion

    
    //#region Meta
    public static writeContianer(_: IStaticDataProvider, metadata: object): void{
        
    }
    protected static readContainer<T>(_: IStaticDataProvider): T {
        return null!;
    }
    //#endregion
    public static read(_: IStaticDataProvider, version: number): void | null{
        if(this.isDeprecated) throw new ReferenceError("Deprecated format, version: " + this.version);
        if(version < this.version) return this.getBase()?.read(_, version)??null;
        return void this.readModule(_);
    }
    protected static readModule(_: IStaticDataProvider): /*IImageContainer*/ {}{ throw new ReferenceError("Unknown version: " + this.version); }
}
FAKE_CONSTRUCTOR.prototype = BaseImageModuleFormat;