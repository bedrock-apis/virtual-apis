import { DataCursorView } from './data-cursor-view';
import { BinaryIO } from './io';
import { BinaryIOReader } from './reader';
import { SafeBinaryIOWriter } from './writer';

export interface MarshalFormat {
   version?: number;
}

export abstract class Marshaller<T extends MarshalFormat> {
   protected size?: number;

   protected abstract version: number;

   protected abstract magic: number;

   public write(data: T) {
      data.version = this.version;
      const io = new SafeBinaryIOWriter(DataCursorView.alloc(this.size), data as object) as unknown as BinaryIO<T>;
      this.marshalHeader(io);

      return io.data.getBuffer();
   }

   private marshalHeader(io: BinaryIO<T>): void {
      io.magic(this.magic);
      (io as BinaryIO<MarshalFormat>).uint8('version');
      this.marshal(io);
   }

   public read(source: Uint8Array<ArrayBufferLike>): T {
      const buffer = new DataCursorView(source);
      const io = new BinaryIOReader(buffer, {}) as unknown as BinaryIO<T>;
      this.marshalHeader(io);

      return io.storage;
   }

   protected abstract marshal(io: BinaryIO<T>): void;
}
