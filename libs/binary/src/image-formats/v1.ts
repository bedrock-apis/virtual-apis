import { IStaticDataProvider } from "../../ref-bapi-nbt/base";
import { BaseImageModuleFormat } from "./base-format";

export class ImageModuleFormatV1 extends BaseImageModuleFormat {
    public static override readonly isDeprecated = false;
    // Version should be hardcoded and don't change (super.version + 1;) is bad practice
    public static override readonly version: number = 1; 
    protected static override readModule(_: IStaticDataProvider): {} {
        return null!;
    }
}