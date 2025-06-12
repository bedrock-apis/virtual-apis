import { IStaticDataProvider } from "../../ref-bapi-nbt/base";
import { ImageModule } from "../structs";
import { BaseImageModuleFormat } from "./base-format";

export class ImageModuleFormatV1 extends BaseImageModuleFormat {
    public static override readonly isDeprecated = false;
    // Version should be hardcoded and don't change (super.version + 1;) is bad practice
    public static override readonly version: number = 1; 
    protected static override readModule(_: IStaticDataProvider): ImageModule {
        const meta = super.readMetadata(_);
        return this.readContainer(_, meta as object);
    }
    protected static getMetadata(m: ImageModule): object{return Object.create(null);}
    protected static override writeModule(_: IStaticDataProvider, m: ImageModule): void {
        this.writeMetadata(_, this.getMetadata(m));
    }
    protected static readContainer(_: IStaticDataProvider, metadata: object): ImageModule{
        return null as unknown as ImageModule;
    }
}