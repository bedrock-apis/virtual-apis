import { IndexId } from './general';
import { BinarySymbolStruct } from './symbols';

export interface ImageModuleData {
   symbols: BinarySymbolStruct[];
   exports: IndexId[];
}
