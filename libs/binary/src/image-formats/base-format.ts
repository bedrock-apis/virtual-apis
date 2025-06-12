import { GeneralNBTFormatReader, GeneralNBTFormatWriter, IStaticDataProvider, NBTFormatReader, NBTFormatWriter } from "../../ref-bapi-nbt/base";
import { BinaryReader, BinaryWriter } from "../binary";
import { NBTTag } from "../../ref-bapi-nbt/tag";
import { ImageModule } from "../structs";

const FAKE_CONSTRUCTOR = function(){};
export class BaseImageModuleFormat {
    protected constructor(){}
    public static readonly MAGIC = 0x696d6176; //'vami' -> in Litte Endian -> VA Module Image
    public static readonly version: number = 0;
    public static readonly isDeprecated: boolean = true;
    public static readonly NBT_FORMAT_READER: NBTFormatReader = new GeneralNBTFormatReader;
    public static readonly NBT_FORMAT_WRITER: NBTFormatWriter = new GeneralNBTFormatWriter;

    protected static getBase<T>(this: T): T | null{
        if(this instanceof FAKE_CONSTRUCTOR) return Reflect.getPrototypeOf(this) as T;
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
    private static readInternal(_: IStaticDataProvider, version: number): ImageModule | null{
        if(this.isDeprecated) throw new ReferenceError("Deprecated format, version: " + this.version);
        if(version > this.version) throw new ReferenceError("Future Yet, Unsupported version, please update virtual-apis package");
        if(version < this.version)
            return (this.getBase() as unknown as {readInternal: (_: IStaticDataProvider, v: number)=>ImageModule})
                ?.readInternal(_, version)??null;
        return this.readModule(_);
    }
    //#region Module
    protected static readModule(_: IStaticDataProvider): ImageModule{
        throw new ReferenceError("Missing implementation, version: " + this.version);
    }
    protected static writeModule(_: IStaticDataProvider, m: ImageModule){
        throw new ReferenceError("Missing implementation, version: " + this.version);
    }
    //#endregion

    public static read(_: IStaticDataProvider): ImageModule{
        const header = this.readHeader(_);
        const m = this.readInternal(_, header.version);
        if(!m)
            throw new ReferenceError("Failed to read image module, version: " + header.version);

        return m;
    }
    public static write(_: IStaticDataProvider, m: ImageModule): void {
        _.pointer = this.HEADER_SIZE; // Skip header

        // Write module
        this.writeModule(_, m);

        // Write header with righ module size
        const size = _.pointer - this.HEADER_SIZE;
        _.pointer = 0;
        this.writeHeader(_, size);

        // Correct full length
        _.pointer = size + this.HEADER_SIZE;
    }
}
FAKE_CONSTRUCTOR.prototype = BaseImageModuleFormat;