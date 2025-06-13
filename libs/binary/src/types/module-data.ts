import { IndexId } from './general';
import { SerializableSymbol } from './symbols';

export interface ImageModuleData {
   symbols: SerializableSymbol[];
   exports: IndexId[];
}
