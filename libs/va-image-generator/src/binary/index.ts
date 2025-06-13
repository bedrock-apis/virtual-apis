import { CurrentBinaryImageSerializer, StaticDataSource } from '@bedrock-apis/binary';
import { IMetadataProvider } from '../metadata-provider';
import { IndexedCollector } from './indexed-collector';
import { ModuleMetadata } from '@bedrock-apis/binary';

const CIS = CurrentBinaryImageSerializer;
export async function main(metadataProvider: IMetadataProvider): Promise<number> {
   const stringCollector = new IndexedCollector<string>();
   const toIndex = (str: string) => stringCollector.getAdd(str);
   const modules = [];
   for await (const metadata of metadataProvider.getMetadataModules()) {
      for (const cl of metadata.classes) stringCollector.getAdd(cl.name);
      metadata.modules.push({
         metadata: {
            name: toIndex(metadata.name),
            uuid: toIndex(metadata.uuid),
            version: toIndex(metadata.version),
         } satisfies ModuleMetadata,
         exports: metadata.classes.map(c => toIndex(c.name)),
      });
   }
   console.log(stringCollector.getArray());

   const buffer = StaticDataSource.Alloc(2 ** 16); // About 64*1K -> 65536 bytes
   console.log(CIS.version);
   CIS.WriteGeneralHeader(buffer, {
      metadata: { engine: toIndex('1.21.80.0') },
      stringSlices: stringCollector.getArray(),
      version: CurrentBinaryImageSerializer.version,
   });
   for (const field of modules) {
      console.log('Write Module');
      CIS.WriteFieldHeader(buffer, field.metadata);
      CIS.WriteModuleField(buffer, { exports: field.exports });
   }
   return 0;
}
