import { IndexedCollector } from '@bedrock-apis/common';
import { BinaryIO, MarshalSerializable } from '../binary/io';

/////////////////////
/// PROPOSAL CODE
////////////////////
export class BinaryImageBundle implements MarshalSerializable<BinaryImageBundle> {
   public static readonly version = 1;
   public readonly version = BinaryImageBundle.version;
   public readonly globalStrings = new GlobalStringsCollector();
   // public readonly available modules: string[]
   // public readonly modules: ....

   public marshal(io: BinaryIO<BinaryImageBundle>): BinaryImageBundle {
      io.uint16('version');
      io.marshal('globalStrings', GlobalStringsCollector);
      return this;
   }
}
export class GlobalStringsCollector
   extends IndexedCollector<string>
   implements MarshalSerializable<GlobalStringsCollector>
{
   public marshal(io: BinaryIO<GlobalStringsCollector>): GlobalStringsCollector {
      io.string8Array16('LIST');
      return this;
   }
   public override LIST: string[] = [];
   public static create() {
      return new this();
   }
}
