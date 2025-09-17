import { getOrGenerateMetadataFilepaths } from '@bedrock-apis/bds-dumps/api';
import { SystemFileMetadataProvider } from '../metadata-provider';
import { main } from './index';

main(new SystemFileMetadataProvider(...(await getOrGenerateMetadataFilepaths()))).then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);
