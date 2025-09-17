import { describe, expect, it } from 'vitest';
import { DataCursorView } from './data-cursor-view';
import { BinaryIO, WithEncapsulatedData } from './io';
import { BinaryIOReader } from './reader';
import { BinaryIOWriter } from './writer';

describe('marshalling test', () => {
   interface SomeData {
      data: number;
      array: number[];
      string: string;
      otherData: {
         longString: string;
         bigNumber: number;
         float: number;
      };
   }
   function marshal(io: BinaryIO<SomeData>) {
      io.uint8('data');
      io.uint16Array8('array');
      io.string8('string');

      const otherDataio = io.sub('otherData');
      otherDataio.string32('longString');
      otherDataio.uint32('bigNumber');
      otherDataio.float64('float');

      io.external({ nbt: io.storage.otherData }).dynamic('nbt');
   }

   function read(source: DataCursorView): SomeData {
      const reader = new BinaryIOReader(source, {}) as unknown as BinaryIO<SomeData>;
      marshal(reader);
      return reader.storage;
   }

   function write(data: SomeData): DataCursorView {
      const cursor = DataCursorView.alloc(1024 * 1024);
      const writer = new BinaryIOWriter(cursor, data as object);
      marshal(writer as unknown as BinaryIO<SomeData>);
      return cursor;
   }

   it('should convert them without changing', () => {
      const data: SomeData = {
         data: 30,
         array: [123, 54, 12],
         string: 'something',
         otherData: {
            longString: 'something'.repeat(4),
            bigNumber: 2 ^ (32 - 10),
            float: 44132.452,
         },
      };

      const cursor = write(data);
      cursor.pointer = 0;

      expect(read(cursor)).toEqual(data);
   });
});

describe('checkpoint test', () => {
   interface SomeData {
      something: string;
      data: ({ n: number; data: Encapsulated } & WithEncapsulatedData)[];
   }
   interface Encapsulated {
      data: number;
      array: number[];
      string: string;
      otherData: {
         longString: string;
         bigNumber: number;
         float: number;
      };
   }
   function marshal(io: BinaryIO<SomeData>) {
      io.string16('something');
      io.array16('data', io => {
         io.uint16('n');
         io.encapsulate16(() => marshalA(io.sub('data')));
      });
   }
   function marshalA(io: BinaryIO<Encapsulated>) {
      io.uint8('data');
      io.uint16Array8('array');
      io.string8('string');

      const otherDataio = io.sub('otherData');
      otherDataio.string32('longString');
      otherDataio.uint32('bigNumber');
      otherDataio.float64('float');

      io.external({ nbt: io.storage.otherData }).dynamic('nbt');
   }

   function read(source: DataCursorView): SomeData {
      const reader = new BinaryIOReader(source, {}) as unknown as BinaryIO<SomeData>;
      marshal(reader);
      return reader.storage;
   }

   function write(data: SomeData): DataCursorView {
      const cursor = DataCursorView.alloc(1024 * 1024);
      const writer = new BinaryIOWriter(cursor, data as object);
      marshal(writer as unknown as BinaryIO<SomeData>);
      return cursor;
   }

   it('should convert them without changing', () => {
      const data: Encapsulated = {
         data: 30,
         array: [123, 54, 12],
         string: 'something',
         otherData: {
            longString: 'something'.repeat(4),
            bigNumber: 2 ^ (32 - 10),
            float: 44132.452,
         },
      };

      const d: SomeData = {
         something: 'something',
         data: [
            { data: data, n: 1 },
            { data: data, n: 2 },
         ],
      };

      const cursor = write(d);
      cursor.pointer = 0;

      const rrr = read(cursor);
      rrr.data.forEach(e => {
         BinaryIO.readEncapsulatedData(e);
      });
      expect(rrr).toEqual(d);
   });
});
